from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import (
    dependency_summary,
    excerpts_for_paths,
    scan_repository,
    summary_json,
    to_json,
)
from app.ai.models.responses import ArchitectureResponse
from app.ai.parsers import parse_architecture
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis


class ArchitectureAgent(BaseAgent):
    """
    Generates an architecture explanation and a Mermaid diagram. Context is
    the summary, detected folder structure, dependency names, and a handful
    of entry-point file excerpts — enough to ground the reasoning without
    sending the whole repository.
    """

    name = "architecture"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        scan = scan_repository(repository)
        entry_point_excerpts = excerpts_for_paths(scan, analysis.summary.entryPoints, max_chars_each=2000)

        return render_prompt(
            "architecture",
            REPOSITORY_NAME=repository.name,
            SUMMARY_JSON=summary_json(analysis),
            IMPORTANT_FOLDERS=to_json([f.model_dump() for f in analysis.important_folders]),
            DEPENDENCY_SUMMARY=dependency_summary(analysis.dependency_graph),
            ENTRY_POINT_EXCERPTS=entry_point_excerpts,
        )

    def parse(self, raw_text: str) -> ArchitectureResponse:
        return parse_architecture(raw_text)


architecture_agent = ArchitectureAgent()
