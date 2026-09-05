from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import (
    excerpts_for_paths,
    files_within_folder,
    immediate_folder_contents,
    scan_repository,
    tech_stack_line,
)
from app.ai.errors import AIParsingError
from app.ai.models.responses import FolderExplanationResponse
from app.ai.parsers import parse_folder_explanation
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis

MAX_REPRESENTATIVE_FILES = 4
MAX_CHARS_PER_FILE = 1200


class FolderExplainerAgent(BaseAgent):
    """
    Explains a single folder the user clicked. Context is scoped to that
    folder only: its immediate contents plus excerpts from a handful of
    representative files inside it — never the rest of the repository.
    """

    name = "folder_explainer"

    def build_prompt(
        self, *, repository: Repository, analysis: RepositoryAnalysis, folder_path: str, **_: object
    ) -> Tuple[str, str]:
        scan = scan_repository(repository)

        if not any(f == folder_path for f in scan.folders):
            raise AIParsingError(f"Folder '{folder_path}' was not found in this repository.")

        candidate_files = sorted(files_within_folder(scan, folder_path), key=lambda p: (p.count("/"), p))[
            :MAX_REPRESENTATIVE_FILES
        ]

        return render_prompt(
            "folder_explainer",
            REPOSITORY_NAME=repository.name,
            TECH_STACK_LINE=tech_stack_line(analysis.summary),
            FOLDER_PATH=folder_path,
            FOLDER_CONTENTS=immediate_folder_contents(scan, folder_path),
            FILE_EXCERPTS=excerpts_for_paths(scan, candidate_files, max_chars_each=MAX_CHARS_PER_FILE),
        )

    def parse(self, raw_text: str) -> FolderExplanationResponse:
        return parse_folder_explanation(raw_text)


folder_explainer_agent = FolderExplainerAgent()
