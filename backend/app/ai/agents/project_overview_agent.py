from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import health_json, summary_json
from app.ai.models.responses import ProjectOverviewResponse
from app.ai.parsers import parse_project_overview
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis


class ProjectOverviewAgent(BaseAgent):
    """
    Generates a plain-language project overview from the Repository
    Intelligence Engine's summary and health metrics alone — no raw source
    code needed for this one.
    """

    name = "project_overview"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        return render_prompt(
            "project_overview",
            REPOSITORY_NAME=repository.name,
            SUMMARY_JSON=summary_json(analysis),
            HEALTH_JSON=health_json(analysis),
        )

    def parse(self, raw_text: str) -> ProjectOverviewResponse:
        return parse_project_overview(raw_text)


project_overview_agent = ProjectOverviewAgent()
