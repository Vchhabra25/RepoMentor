from app.ai.providers.base import AIProvider
from app.ai.providers.claude_provider import claude_provider
from app.ai.providers.groq_provider import groq_provider
from app.config import get_settings


def get_default_provider() -> AIProvider:
    """
    Resolves the AIProvider singleton to use by default, based on
    AI_PROVIDER (claude | groq). ClaudeProvider is the fallback for any
    unrecognized value, though Settings already validates AI_PROVIDER to one
    of the two supported providers before this ever runs.

    Both singletons are constructed eagerly regardless of which one is
    selected — cheap (no network calls in __init__) and keeps this function
    a pure lookup, matching how claude_provider/groq_provider are already
    instantiated as module-level singletons in their own files.
    """
    if get_settings().ai_provider == "groq":
        return groq_provider
    return claude_provider
