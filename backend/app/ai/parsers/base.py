import json
import re
from typing import Type, TypeVar

from pydantic import BaseModel, ValidationError

from app.ai.errors import AIParsingError

_CODE_FENCE_PATTERN = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)

ModelT = TypeVar("ModelT", bound=BaseModel)


def extract_json_object(raw_text: str) -> dict:
    """
    Extracts a single JSON object from raw LLM output. Strips markdown code
    fences and any leading/trailing prose, then locates the outermost
    balanced `{...}` block. Never trusts the text is clean JSON on its own.
    """
    if not raw_text or not raw_text.strip():
        raise AIParsingError("The AI response was empty.")

    cleaned = _CODE_FENCE_PATTERN.sub("", raw_text.strip()).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise AIParsingError("No JSON object found in the AI response.")

    candidate = cleaned[start : end + 1]

    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise AIParsingError(f"AI response was not valid JSON: {exc}") from exc

    if not isinstance(parsed, dict):
        raise AIParsingError("AI response JSON was not an object.")

    return parsed


def parse_into(raw_text: str, model: Type[ModelT]) -> ModelT:
    """Extracts JSON from `raw_text` and validates it into `model`."""
    data = extract_json_object(raw_text)
    try:
        return model.model_validate(data)
    except ValidationError as exc:
        raise AIParsingError(f"AI response didn't match the expected {model.__name__} schema: {exc}") from exc
