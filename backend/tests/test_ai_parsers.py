import pytest

from app.ai.errors import AIParsingError
from app.ai.parsers import parse_into, parse_project_overview
from app.ai.parsers.base import extract_json_object
from app.ai.models.responses import ProjectOverviewResponse


def test_extract_json_object_strips_code_fences():
    raw = '```json\n{"a": 1}\n```'
    assert extract_json_object(raw) == {"a": 1}


def test_extract_json_object_strips_surrounding_prose():
    raw = 'Sure, here is the JSON:\n{"a": 1}\nHope that helps!'
    assert extract_json_object(raw) == {"a": 1}


def test_extract_json_object_raises_on_empty_text():
    with pytest.raises(AIParsingError):
        extract_json_object("")


def test_extract_json_object_raises_when_no_json_present():
    with pytest.raises(AIParsingError):
        extract_json_object("this is not json at all")


def test_extract_json_object_raises_on_malformed_json():
    with pytest.raises(AIParsingError):
        extract_json_object("{not valid json,,,}")


def test_parse_into_validates_against_schema():
    payload = (
        '{"purpose": "p", "tech_stack_summary": "t", '
        '"high_level_workflow": "w", "important_technologies": ["React"]}'
    )
    result = parse_into(payload, ProjectOverviewResponse)
    assert result.purpose == "p"
    assert result.important_technologies == ["React"]


def test_parse_into_raises_on_schema_mismatch():
    with pytest.raises(AIParsingError):
        parse_into('{"totally": "wrong shape"}', ProjectOverviewResponse)


def test_parse_project_overview_convenience_function():
    payload = '{"purpose": "p", "tech_stack_summary": "t", "high_level_workflow": "w", "important_technologies": []}'
    result = parse_project_overview(payload)
    assert isinstance(result, ProjectOverviewResponse)
