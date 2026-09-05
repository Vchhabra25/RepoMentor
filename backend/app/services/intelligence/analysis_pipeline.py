from datetime import datetime, timezone
from pathlib import Path

from app.models import Repository, RepositoryAnalysis
from app.services.intelligence.analysis_store import analysis_store
from app.services.intelligence.configuration_detector import configuration_detector
from app.services.intelligence.dependency_detector import dependency_detector
from app.services.intelligence.entry_point_detector import entry_point_detector
from app.services.intelligence.framework_detector import framework_detector
from app.services.intelligence.language_detector import language_detector
from app.services.intelligence.project_health_service import project_health_service
from app.services.intelligence.project_structure_service import project_structure_service
from app.services.intelligence.repository_scanner import repository_scanner
from app.services.intelligence.summary_generator import summary_generator


class AnalysisPipeline:
    """
    Runs the full, deterministic Repository Intelligence Engine pipeline:

        scan -> languages -> dependencies -> frameworks -> entry points
        -> configuration files -> project structure -> health -> summary

    No AI, no LLM calls — every step is rule-based and reproducible. The
    result is stored via AnalysisStore and is exactly what future AI
    modules are expected to read as their starting context.
    """

    @staticmethod
    def run(repository: Repository) -> RepositoryAnalysis:
        root = Path(repository.root_directory)
        scan = repository_scanner.scan(root)

        languages = language_detector.detect(scan)
        dependencies = dependency_detector.detect(scan, repository_name=repository.name)
        dependency_names = {node.name.lower() for node in dependencies.graph.nodes}
        frameworks = framework_detector.detect(scan, dependency_names)
        entry_points = entry_point_detector.detect(scan)
        configuration_files = configuration_detector.detect(scan)
        important_folders = project_structure_service.detect(scan)
        health = project_health_service.compute(scan, languages)

        summary = summary_generator.generate(
            repository_name=repository.name,
            languages=languages,
            frameworks=frameworks,
            dependencies=dependencies,
            entry_points=entry_points,
            configuration_files=configuration_files,
            important_folders=important_folders,
        )

        analysis = RepositoryAnalysis(
            repository_id=repository.id,
            summary=summary,
            health=health,
            dependency_graph=dependencies.graph,
            detected_frameworks=frameworks.frameworks,
            detected_databases=dependencies.databases,
            detected_auth_methods=dependencies.auth_methods,
            detected_cloud_targets=dependencies.cloud_targets,
            important_folders=important_folders,
            generated_at=datetime.now(timezone.utc),
        )

        analysis_store.save(analysis)
        return analysis


analysis_pipeline = AnalysisPipeline()
