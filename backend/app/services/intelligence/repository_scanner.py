from dataclasses import dataclass, field
from pathlib import Path
from typing import List

from app.utils import is_ignored_dir, is_ignored_file


@dataclass
class ScannedFile:
    relative_path: str  # POSIX-style, relative to the repository root
    name: str
    extension: str  # lowercase, includes the leading dot (e.g. ".py"); "" if none
    size_bytes: int
    depth: int  # number of path segments, e.g. "src/app.py" -> 2


@dataclass
class ScanResult:
    root: Path
    files: List[ScannedFile] = field(default_factory=list)
    folders: List[str] = field(default_factory=list)  # relative folder paths

    def file_by_name(self, name: str) -> List[ScannedFile]:
        return [f for f in self.files if f.name == name]

    def read_text(self, relative_path: str, max_bytes: int = 2_000_000) -> str:
        """
        Reads a file's text content, bounded, for downstream manifest parsing.

        `relative_path` values reaching this method today are already
        validated against `self.files` by every caller (see
        file_explainer_agent / folder_explainer_agent), so this can't
        currently be reached with a traversal payload. The check below is
        defense-in-depth: it keeps the method safe on its own terms —
        refusing anything that resolves outside the repository root — so a
        future caller can't reintroduce a path-traversal bug by skipping
        that upstream validation.
        """
        try:
            resolved_root = self.root.resolve()
            path = (resolved_root / relative_path).resolve()
            if path != resolved_root and resolved_root not in path.parents:
                return ""
            if path.stat().st_size > max_bytes:
                return ""
            return path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            return ""


class RepositoryScanner:
    """
    Walks an ingested repository exactly once and produces a flat inventory
    of files and folders. Every other intelligence service reads from this
    ScanResult instead of touching the filesystem directly, so the pipeline
    only pays the cost of a directory walk a single time.
    """

    @staticmethod
    def scan(root: Path) -> ScanResult:
        result = ScanResult(root=root)

        for path in sorted(root.rglob("*")):
            relative = path.relative_to(root)
            parts = relative.parts

            # Defense in depth: ingestion already strips ignored paths, but a
            # scan shouldn't trust that blindly.
            if any(is_ignored_dir(part) for part in parts[:-1]):
                continue

            if path.is_dir():
                if is_ignored_dir(path.name):
                    continue
                result.folders.append(relative.as_posix())
            elif path.is_file():
                if is_ignored_file(path.name):
                    continue
                try:
                    size = path.stat().st_size
                except OSError:
                    size = 0
                result.files.append(
                    ScannedFile(
                        relative_path=relative.as_posix(),
                        name=path.name,
                        extension=path.suffix.lower(),
                        size_bytes=size,
                        depth=len(parts),
                    )
                )

        return result


repository_scanner = RepositoryScanner()
