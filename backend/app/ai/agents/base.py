from abc import ABC, abstractmethod
from typing import Any, AsyncIterator, Tuple

from app.ai.models.responses import AgentResponseModel
from app.ai.providers.base import AIProvider


class BaseAgent(ABC):
    """
    Every specialized agent has exactly one responsibility: build a prompt
    from a narrow slice of repository context, call the LLM through the
    provided AIProvider, and parse the result into its own response model.

    Agents never talk to the LLM SDK directly (they go through AIProvider)
    and never decide caching (that's the orchestrator's job) — they're a
    pure prompt-in, structured-object-out unit.
    """

    name: str

    @abstractmethod
    def build_prompt(self, **context: Any) -> Tuple[str, str]:
        """Returns (system_prompt, user_prompt) built from this agent's own template + context slice."""
        raise NotImplementedError

    @abstractmethod
    def parse(self, raw_text: str) -> AgentResponseModel:
        """Parses raw LLM text into this agent's response model. Never trusts it as-is."""
        raise NotImplementedError

    async def run(self, provider: AIProvider, **context: Any) -> AgentResponseModel:
        system_prompt, user_prompt = self.build_prompt(**context)
        raw_text = await provider.complete(system_prompt=system_prompt, user_prompt=user_prompt)
        return self.parse(raw_text)

    async def stream(self, provider: AIProvider, **context: Any) -> AsyncIterator[str]:
        system_prompt, user_prompt = self.build_prompt(**context)
        async for chunk in provider.stream(system_prompt=system_prompt, user_prompt=user_prompt):
            yield chunk
