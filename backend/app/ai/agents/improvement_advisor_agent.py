from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import dependency_summary, health_json, read_excerpt, scan_repository, summary_json
from app.ai.models.responses import ImprovementSuggestionsResponse
from app.ai.parsers import parse_improvement_suggestions
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis

MAX_LARGEST_FILE_CHARS = 3000


class ImprovementAdvisorAgent(BaseAgent):
    """
    Suggests concrete improvements grounded in the repository's structural
    metadata, health metrics, and dependency graph — plus an excerpt of the
    largest file, since it's often the most improvement-worthy single file.
    """

    name = "improvement_advisor"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        largest_file_excerpt = "Not available."
        if analysis.health.largest_file:
            scan = scan_repository(repository)
            content = read_excerpt(scan, analysis.health.largest_file, MAX_LARGEST_FILE_CHARS)
            if content:
                largest_file_excerpt = f"--- {analysis.health.largest_file} ---\n{content}"

        return render_prompt(
            "improvement_advisor",
            REPOSITORY_NAME=repository.name,
            SUMMARY_JSON=summary_json(analysis),
            HEALTH_JSON=health_json(analysis),
            DEPENDENCY_SUMMARY=dependency_summary(analysis.dependency_graph),
            LARGEST_FILE_EXCERPT=largest_file_excerpt,
        )

    def parse(self, raw_text: str) -> ImprovementSuggestionsResponse:
        return parse_improvement_suggestions(raw_text)


improvement_advisor_agent = ImprovementAdvisorAgent()
