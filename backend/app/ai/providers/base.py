from abc import ABC, abstractmethod
from typing import AsyncIterator


class AIProvider(ABC):
    """
    Abstract LLM provider. Agents and the orchestrator only ever talk to
    this interface — never to a specific vendor SDK — so a new provider
    (OpenAIProvider, GeminiProvider, ...) can be added later without
    touching agents, prompts, parsers, or the orchestrator.
    """

    @abstractmethod
    async def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        """Runs a single non-streaming completion and returns the full text."""
        raise NotImplementedError

    @abstractmethod
    def stream(self, *, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        """Runs a streaming completion, yielding text deltas as they arrive."""
        raise NotImplementedError
