from typing import List, Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import excerpts_for_paths, files_within_folder, scan_repository
from app.ai.models.responses import ApiDocumentationResponse
from app.ai.parsers import parse_api_documentation
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis

ROUTE_FOLDER_CATEGORIES = {"routes", "controllers", "backend"}
MAX_ROUTE_FILES = 8
MAX_CHARS_PER_FILE = 2000


class ApiDocumentationAgent(BaseAgent):
    """
    Documents API endpoints from route/controller source code. Context is
    limited to files inside folders the Intelligence Engine already
    categorized as routes/controllers/backend, plus entry points as a
    fallback — never the whole repository.
    """

    name = "api_documentation"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        scan = scan_repository(repository)

        route_paths: List[str] = []
        for folder in analysis.important_folders:
            if folder.category in ROUTE_FOLDER_CATEGORIES:
                route_paths.extend(files_within_folder(scan, folder.path))

        route_paths = sorted(set(route_paths))[:MAX_ROUTE_FILES]
        route_excerpts = excerpts_for_paths(scan, route_paths, max_chars_each=MAX_CHARS_PER_FILE)
        entry_point_excerpts = excerpts_for_paths(scan, analysis.summary.entryPoints, max_chars_each=MAX_CHARS_PER_FILE)

        return render_prompt(
            "api_documentation",
            REPOSITORY_NAME=repository.name,
            BACKEND_FRAMEWORK=analysis.summary.backend or "Unknown",
            ROUTE_EXCERPTS=route_excerpts,
            ENTRY_POINT_EXCERPTS=entry_point_excerpts,
        )

    def parse(self, raw_text: str) -> ApiDocumentationResponse:
        return parse_api_documentation(raw_text)


api_documentation_agent = ApiDocumentationAgent()
