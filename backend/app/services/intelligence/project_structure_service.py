from typing import List

from app.models import ImportantFolder
from app.services.intelligence.repository_scanner import ScanResult

# folder name (lowercase) -> category label. Order matters only for output
# stability; matching is by exact folder-name equality, case-insensitive.
STRUCTURE_KEYWORDS = {
    "frontend": "frontend",
    "client": "frontend",
    "web": "frontend",
    "backend": "backend",
    "server": "backend",
    "api": "backend",
    "shared": "shared",
    "common": "shared",
    "public": "public",
    "static": "public",
    "components": "components",
    "hooks": "hooks",
    "services": "services",
    "models": "models",
    "controllers": "controllers",
    "routes": "routes",
    "utils": "utils",
    "helpers": "utils",
    "assets": "assets",
}


class ProjectStructureService:
    """
    Scans folder names for conventional project-structure keywords
    (frontend/backend/components/hooks/services/...) and records the first
    matching path for each category found.
    """

    @staticmethod
    def detect(scan: ScanResult) -> List[ImportantFolder]:
        found: dict[str, str] = {}

        for folder in sorted(scan.folders, key=lambda p: len(p.split("/"))):
            folder_name = folder.rsplit("/", 1)[-1].lower()
            category = STRUCTURE_KEYWORDS.get(folder_name)
            if category and category not in found:
                found[category] = folder

        return [ImportantFolder(category=category, path=path) for category, path in found.items()]


project_structure_service = ProjectStructureService()
