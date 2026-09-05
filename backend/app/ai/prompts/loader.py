import re
from pathlib import Path
from typing import Tuple

TEMPLATES_DIR = Path(__file__).parent / "templates"
_TOKEN_PATTERN = re.compile(r"\{\{\s*([A-Z0-9_]+)\s*\}\}")


def render_prompt(template_name: str, **variables: str) -> Tuple[str, str]:
    """
    Loads `<template_name>.system.md` and `<template_name>.user.md`,
    substitutes `{{TOKEN}}` placeholders with the given variables, and
    returns (system_prompt, user_prompt).

    Substitution is a plain token replace (not str.format) so JSON/curly
    braces inside injected context never collide with template syntax.
    """
    system = _render_file(template_name, "system", variables)
    user = _render_file(template_name, "user", variables)
    return system, user


def _render_file(template_name: str, kind: str, variables: dict) -> str:
    path = TEMPLATES_DIR / f"{template_name}.{kind}.md"
    template = path.read_text(encoding="utf-8")

    def substitute(match: re.Match) -> str:
        key = match.group(1)
        return str(variables[key]) if key in variables else match.group(0)

    return _TOKEN_PATTERN.sub(substitute, template)
