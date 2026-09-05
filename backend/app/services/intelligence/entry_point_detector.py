from typing import List

from app.services.intelligence.repository_scanner import ScanResult

ENTRY_POINT_FILENAMES = {
    "main.py",
    "app.py",
    "server.js",
    "index.js",
    "index.ts",
    "App.tsx",
    "App.jsx",
    "main.tsx",
    "Program.cs",
    "Application.java",
}


class EntryPointDetector:
    """Finds files that conventionally act as an application's entry point."""

    @staticmethod
    def detect(scan: ScanResult) -> List[str]:
        matches = [file.relative_path for file in scan.files if file.name in ENTRY_POINT_FILENAMES]
        return sorted(matches)


entry_point_detector = EntryPointDetector()
