from app.ai.models.responses import ReadmeResponse
from app.ai.parsers.base import parse_into


def parse_readme(raw_text: str) -> ReadmeResponse:
    return parse_into(raw_text, ReadmeResponse)
