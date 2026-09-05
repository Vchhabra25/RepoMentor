from app.ai.models.responses import FileExplanationResponse
from app.ai.parsers.base import parse_into


def parse_file_explanation(raw_text: str) -> FileExplanationResponse:
    return parse_into(raw_text, FileExplanationResponse)
