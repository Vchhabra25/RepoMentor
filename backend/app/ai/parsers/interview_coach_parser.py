from app.ai.models.responses import InterviewQuestionsResponse
from app.ai.parsers.base import parse_into


def parse_interview_questions(raw_text: str) -> InterviewQuestionsResponse:
    return parse_into(raw_text, InterviewQuestionsResponse)
