from app.ai.models.responses import ProjectOverviewResponse
from app.ai.parsers.base import parse_into


def parse_project_overview(raw_text: str) -> ProjectOverviewResponse:
    return parse_into(raw_text, ProjectOverviewResponse)
