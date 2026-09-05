from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import summary_json, to_json
from app.ai.models.responses import ReadmeResponse
from app.ai.parsers import parse_readme
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis


class ReadmeGeneratorAgent(BaseAgent):
    """
    Generates a full README.md. Purely structural context — summary,
    folders, entry points, configuration files — no raw source needed.
    """

    name = "readme_generator"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        return render_prompt(
            "readme_generator",
            REPOSITORY_NAME=repository.name,
            SUMMARY_JSON=summary_json(analysis),
            IMPORTANT_FOLDERS=to_json([f.model_dump() for f in analysis.important_folders]),
            ENTRY_POINTS=to_json(analysis.summary.entryPoints),
            CONFIGURATION_FILES=to_json(analysis.summary.configurationFiles),
        )

    def parse(self, raw_text: str) -> ReadmeResponse:
        return parse_readme(raw_text)


readme_generator_agent = ReadmeGeneratorAgent()
