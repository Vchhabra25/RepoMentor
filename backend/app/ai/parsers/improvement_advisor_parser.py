from app.ai.models.responses import ImprovementSuggestionsResponse
from app.ai.parsers.base import parse_into


def parse_improvement_suggestions(raw_text: str) -> ImprovementSuggestionsResponse:
    return parse_into(raw_text, ImprovementSuggestionsResponse)
