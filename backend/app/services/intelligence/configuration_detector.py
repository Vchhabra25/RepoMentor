from typing import List

from app.services.intelligence.repository_scanner import ScanResult

CONFIGURATION_FILENAMES = {
    "package.json",
    "requirements.txt",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "firebase.json",
    "vite.config.ts",
    "vite.config.js",
    "tsconfig.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "tailwind.config.js",
    "tailwind.config.ts",
    ".env.example",
}


class ConfigurationDetector:
    """Finds known configuration and manifest files anywhere in the repository."""

    @staticmethod
    def detect(scan: ScanResult) -> List[str]:
        matches = [file.relative_path for file in scan.files if file.name in CONFIGURATION_FILENAMES]
        return sorted(matches)


configuration_detector = ConfigurationDetector()
