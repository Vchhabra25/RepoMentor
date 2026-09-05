from app.ai.models.responses import ArchitectureResponse
from app.ai.parsers.base import parse_into


def parse_architecture(raw_text: str) -> ArchitectureResponse:
    return parse_into(raw_text, ArchitectureResponse)
