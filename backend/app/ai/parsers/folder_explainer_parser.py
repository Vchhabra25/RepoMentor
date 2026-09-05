from app.ai.models.responses import FolderExplanationResponse
from app.ai.parsers.base import parse_into


def parse_folder_explanation(raw_text: str) -> FolderExplanationResponse:
    return parse_into(raw_text, FolderExplanationResponse)
