import shutil
from collections import Counter
from pathlib import Path
from typing import Optional, TypedDict

from app.utils import is_ignored_dir, is_ignored_file

LANGUAGE_BY_EXTENSION = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".mjs": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".java": "Java",
    ".go": "Go",
    ".rb": "Ruby",
    ".php": "PHP",
    ".c": "C",
    ".h": "C",
    ".cpp": "C++",
    ".hpp": "C++",
    ".cs": "C#",
    ".rs": "Rust",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".m": "Objective-C",
    ".scala": "Scala",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".vue": "Vue",
    ".sh": "Shell",
    ".sql": "SQL",
    ".dart": "Dart",
    ".ex": "Elixir",
    ".exs": "Elixir",
}


class RepositoryStats(TypedDict):
    file_count: int
    folder_count: int
    size_bytes: int
    primary_language: Optional[str]


class MetadataService:
    """
    Cleans ignored paths out of an ingested repository and computes the
    statistics shown on the Overview / Repository Details pages: file and
    folder counts, total size, and a best-guess primary language.
    """

    @staticmethod
    def clean_ignored(root: Path) -> None:
        """Removes ignored directories and files in-place, deepest paths first."""
        for path in sorted(root.rglob("*"), key=lambda p: len(p.parts), reverse=True):
            if not path.exists():
                continue
            if path.is_dir() and is_ignored_dir(path.name):
                shutil.rmtree(path, ignore_errors=True)
            elif path.is_file() and is_ignored_file(path.name):
                path.unlink(missing_ok=True)

    @staticmethod
    def compute(root: Path) -> RepositoryStats:
        """Walks the (already-cleaned) tree and returns aggregate statistics."""
        file_count = 0
        folder_count = 0
        size_bytes = 0
        extension_counts: Counter = Counter()

        for path in root.rglob("*"):
            if path.is_dir():
                folder_count += 1
                continue
            if not path.is_file():
                continue

            file_count += 1
            try:
                size_bytes += path.stat().st_size
            except OSError:
                pass

            extension = path.suffix.lower()
            if extension in LANGUAGE_BY_EXTENSION:
                extension_counts[extension] += 1

        primary_language = None
        if extension_counts:
            top_extension, _ = extension_counts.most_common(1)[0]
            primary_language = LANGUAGE_BY_EXTENSION[top_extension]

        return RepositoryStats(
            file_count=file_count,
            folder_count=folder_count,
            size_bytes=size_bytes,
            primary_language=primary_language,
        )


metadata_service = MetadataService()
