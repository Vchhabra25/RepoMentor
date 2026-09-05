from typing import Tuple

from app.ai.agents.base import BaseAgent
from app.ai.context_utils import health_json, summary_json
from app.ai.models.responses import InterviewQuestionsResponse
from app.ai.parsers import parse_interview_questions
from app.ai.prompts import render_prompt
from app.models import Repository, RepositoryAnalysis


class InterviewCoachAgent(BaseAgent):
    """
    Generates interview prep material grounded in this repository's actual
    detected stack and architecture — summary and health metrics only, no
    source code needed.
    """

    name = "interview_coach"

    def build_prompt(self, *, repository: Repository, analysis: RepositoryAnalysis, **_: object) -> Tuple[str, str]:
        return render_prompt(
            "interview_coach",
            REPOSITORY_NAME=repository.name,
            SUMMARY_JSON=summary_json(analysis),
            HEALTH_JSON=health_json(analysis),
        )

    def parse(self, raw_text: str) -> InterviewQuestionsResponse:
        return parse_interview_questions(raw_text)


interview_coach_agent = InterviewCoachAgent()
