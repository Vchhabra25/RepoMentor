import json
from pathlib import Path
from typing import Dict, Iterable, List

from app.models import DependencyGraph, Repository, RepositoryAnalysis, RepositorySummary
from app.services.intelligence.repository_scanner import ScanResult, repository_scanner

DEFAULT_FILE_EXCERPT_CHARS = 3000


def scan_repository(repository: Repository) -> ScanResult:
    """Re-scans an ingested repository's directory. Cheap relative to an LLM call."""
    return repository_scanner.scan(Path(repository.root_directory))


def to_json(value) -> str:
    """Compact, deterministic JSON formatting for prompt injection."""
    if hasattr(value, "model_dump"):
        value = value.model_dump(mode="json")
    return json.dumps(value, indent=2, ensure_ascii=False, sort_keys=True)


def summary_json(analysis: RepositoryAnalysis) -> str:
    return to_json(analysis.summary)


def health_json(analysis: RepositoryAnalysis) -> str:
    return to_json(analysis.health)


def tech_stack_line(summary: RepositorySummary) -> str:
    parts = [p for p in (summary.framework, ", ".join(summary.languages)) if p]
    return " | ".join(parts) if parts else "Unknown stack"


def dependency_summary(graph: DependencyGraph, max_per_ecosystem: int = 15) -> str:
    """Groups dependency names by ecosystem — names only, no versions/paths, to keep tokens low."""
    by_ecosystem: Dict[str, List[str]] = {}
    for node in graph.nodes:
        by_ecosystem.setdefault(node.ecosystem, [])
        if len(by_ecosystem[node.ecosystem]) < max_per_ecosystem and node.name not in by_ecosystem[node.ecosystem]:
            by_ecosystem[node.ecosystem].append(node.name)

    if not by_ecosystem:
        return "No dependencies detected."

    lines = [f"- {ecosystem}: {', '.join(names)}" for ecosystem, names in sorted(by_ecosystem.items())]
    return "\n".join(lines)


def read_excerpt(scan: ScanResult, relative_path: str, max_chars: int = DEFAULT_FILE_EXCERPT_CHARS) -> str:
    content = scan.read_text(relative_path)
    if len(content) > max_chars:
        return content[:max_chars] + f"\n... (truncated, {len(content) - max_chars} more characters)"
    return content


def excerpts_for_paths(scan: ScanResult, paths: Iterable[str], max_chars_each: int = DEFAULT_FILE_EXCERPT_CHARS) -> str:
    """Formats bounded excerpts for a set of files as a single prompt-ready block."""
    blocks = []
    for path in paths:
        content = read_excerpt(scan, path, max_chars_each)
        if content:
            blocks.append(f"--- {path} ---\n{content}")
    return "\n\n".join(blocks) if blocks else "None available."


def immediate_folder_contents(scan: ScanResult, folder_path: str) -> str:
    """Lists the immediate files and subfolders directly inside `folder_path`."""
    prefix = folder_path.rstrip("/") + "/"
    depth = prefix.count("/")

    children_files = [
        f.relative_path for f in scan.files if f.relative_path.startswith(prefix) and f.depth == depth
    ]
    children_folders = [
        folder
        for folder in scan.folders
        if folder.startswith(prefix) and folder.count("/") == depth and folder != folder_path
    ]

    lines = [f"folder: {f}" for f in sorted(children_folders)] + [f"file: {f}" for f in sorted(children_files)]
    return "\n".join(lines) if lines else "This folder appears to be empty (after ignored paths were removed)."


def files_within_folder(scan: ScanResult, folder_path: str) -> List[str]:
    prefix = folder_path.rstrip("/") + "/"
    return [f.relative_path for f in scan.files if f.relative_path.startswith(prefix)]
