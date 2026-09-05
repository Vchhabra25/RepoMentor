from app.ai.models.responses import ApiDocumentationResponse
from app.ai.parsers.base import parse_into


def parse_api_documentation(raw_text: str) -> ApiDocumentationResponse:
    return parse_into(raw_text, ApiDocumentationResponse)
