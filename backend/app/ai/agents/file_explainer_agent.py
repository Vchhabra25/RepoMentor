from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import read_excerpt, scan_repository, tech_stack_line
from app.ai.errors import AIParsingError
from app.ai.models.responses import FileExplanationResponse
from app.ai.parsers import parse_file_explanation
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis
from app.utils.language_map import LANGUAGE_BY_EXTENSION

MAX_FILE_CHARS = 6000


class FileExplainerAgent(BaseAgent):
    """
    Explains a single file the user clicked. Context is that one file's
    content only (bounded), plus a one-line tech stack note for grounding —
    never the rest of the repository.
    """

    name = "file_explainer"

    def build_prompt(
        self, *, repository: Repository, analysis: RepositoryAnalysis, file_path: str, **_: object
    ) -> Tuple[str, str]:
        scan = scan_repository(repository)

        matching = [f for f in scan.files if f.relative_path == file_path]
        if not matching:
            raise AIParsingError(f"File '{file_path}' was not found in this repository.")

        file = matching[0]
        content = read_excerpt(scan, file_path, MAX_FILE_CHARS)
        language = LANGUAGE_BY_EXTENSION.get(file.extension, file.extension or "unknown")

        return render_prompt(
            "file_explainer",
            REPOSITORY_NAME=repository.name,
            TECH_STACK_LINE=tech_stack_line(analysis.summary),
            FILE_PATH=file_path,
            FILE_LANGUAGE=language,
            FILE_CONTENT=content or "(file is empty)",
        )

    def parse(self, raw_text: str) -> FileExplanationResponse:
        return parse_file_explanation(raw_text)


file_explainer_agent = FileExplainerAgent()
