from datetime import datetime, timezone
from typing import List

from app.models import ImportantFolder, RepositorySummary
from app.services.intelligence.dependency_detector import DependencyDetectionResult
from app.services.intelligence.framework_detector import FrameworkDetectionResult
from app.services.intelligence.language_detector import LanguageDetectionResult


class SummaryGenerator:
    """
    Combines every detector's output into the compact RepositorySummary
    object that future AI prompts are expected to consume, plus a
    deterministic `estimatedArchitecture` label.
    """

    @staticmethod
    def generate(
        *,
        repository_name: str,
        languages: LanguageDetectionResult,
        frameworks: FrameworkDetectionResult,
        dependencies: DependencyDetectionResult,
        entry_points: List[str],
        configuration_files: List[str],
        important_folders: List[ImportantFolder],
    ) -> RepositorySummary:
        framework_label = " + ".join(
            f for f in (frameworks.frontend_framework, frameworks.backend_framework) if f
        ) or (frameworks.frameworks[0] if frameworks.frameworks else "")

        important_folder_paths = [folder.path for folder in important_folders]
        important_files = sorted(set(entry_points) | set(configuration_files))

        return RepositorySummary(
            name=repository_name,
            framework=framework_label,
            frontend=frameworks.frontend_framework or "",
            backend=frameworks.backend_framework or "",
            database=dependencies.databases[0] if dependencies.databases else "",
            authentication=dependencies.auth_methods[0] if dependencies.auth_methods else "",
            deployment=dependencies.cloud_targets[0] if dependencies.cloud_targets else "",
            languages=languages.languages,
            packageManagers=dependencies.package_managers,
            entryPoints=entry_points,
            configurationFiles=configuration_files,
            importantFolders=important_folder_paths,
            importantFiles=important_files,
            estimatedArchitecture=SummaryGenerator._estimate_architecture(frameworks, important_folder_paths),
            analysisTimestamp=datetime.now(timezone.utc).isoformat(),
        )

    @staticmethod
    def _estimate_architecture(frameworks: FrameworkDetectionResult, important_folder_paths: List[str]) -> str:
        has_frontend_folder = any("frontend" in p.split("/") for p in important_folder_paths) or any(
            p.split("/")[0].lower() in ("frontend", "client", "web") for p in important_folder_paths
        )
        has_backend_folder = any(
            p.split("/")[0].lower() in ("backend", "server", "api") for p in important_folder_paths
        )

        if has_frontend_folder and has_backend_folder:
            return "Monorepo (Frontend + Backend)"
        if frameworks.frontend_framework and frameworks.backend_framework:
            return "Fullstack Application (Frontend + Backend)"
        if frameworks.frontend_framework:
            return "Frontend Application"
        if frameworks.backend_framework:
            return "Backend Service / API"
        return "Unclassified / Library"


summary_generator = SummaryGenerator()
