"""
Paths that are stripped out of every ingested repository before metadata is
computed — build artifacts, dependency caches, VCS internals, and binary
assets that add noise (and size) without helping future code analysis.
"""

IGNORED_DIR_NAMES = {
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    "target",
    "bin",
    "obj",
    ".cache",
    ".next",
    "vendor",
    "venv",
    "__pycache__",
    ".idea",
    ".vscode",
}

IGNORED_FILE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
    ".mp4",
    ".zip",
}


def is_ignored_dir(name: str) -> bool:
    return name in IGNORED_DIR_NAMES


def is_ignored_file(name: str) -> bool:
    return any(name.lower().endswith(ext) for ext in IGNORED_FILE_EXTENSIONS)
