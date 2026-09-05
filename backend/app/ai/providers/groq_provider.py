from typing import AsyncIterator

import groq
from groq import AsyncGroq
import logging

logger = logging.getLogger(__name__)

from app.ai.errors import (
    AIConfigurationError,
    AIConnectionError,
    AIEmptyResponseError,
    AIProviderResponseError,
    AIRateLimitError,
    AITimeoutError,
)
from app.ai.providers.base import AIProvider
from app.config import get_settings


class GroqProvider(AIProvider):
    """
    AIProvider backed by the Groq API (OpenAI-compatible chat-completions
    shape). Sibling to ClaudeProvider — same interface, same error mapping —
    so agents, the orchestrator, prompts, and parsers are unaffected by
    which one is active. Selected via AI_PROVIDER=groq (see
    app/ai/providers/factory.py).
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._model = settings.groq_model
        self._max_tokens = settings.ai_max_tokens
        self._timeout = settings.ai_request_timeout_seconds
        self._api_key = settings.groq_api_key
        self._client: AsyncGroq | None = (
            AsyncGroq(api_key=self._api_key, timeout=self._timeout) if self._api_key else None
        )

    def _require_client(self) -> AsyncGroq:
        if self._client is None:
            raise AIConfigurationError("GROQ_API_KEY is not set. Configure it to enable AI-powered endpoints.")
        return self._client

    @staticmethod
    def _messages(system_prompt: str, user_prompt: str) -> list[dict[str, str]]:
        # Groq's chat-completions API takes the system prompt as a message
        # rather than a separate top-level field (Anthropic's shape) — this
        # is the one real shape difference between the two providers, and it
        # stays fully contained here.
        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

    async def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        client = self._require_client()
        try:
            response = await client.chat.completions.create(
                model=self._model,
                max_tokens=self._max_tokens,
                messages=self._messages(system_prompt, user_prompt),
            )
        except groq.APITimeoutError as exc:
            raise AITimeoutError("The AI request timed out.") from exc
        except groq.RateLimitError as exc:
            raise AIRateLimitError("The AI provider rate-limited this request.") from exc
        except groq.APIConnectionError as exc:
            raise AIConnectionError("Couldn't reach the AI provider.") from exc
        except groq.APIStatusError as exc:
            raise AIProviderResponseError(f"AI provider returned an error: {exc.status_code}") from exc

        text = response.choices[0].message.content or ""
        print("\n" + "=" * 60)
        print("RAW GROQ RESPONSE")
        print("=" * 60)
        print(text)
        print("=" * 60 + "\n")

        if not text.strip():
            raise AIEmptyResponseError("The AI provider returned an empty response.")
        return text

    async def stream(self, *, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        client = self._require_client()
        received_any = False
        try:
            completion_stream = await client.chat.completions.create(
                model=self._model,
                max_tokens=self._max_tokens,
                messages=self._messages(system_prompt, user_prompt),
                stream=True,
            )
            async for chunk in completion_stream:
                delta = chunk.choices[0].delta.content if chunk.choices else None
                if delta:
                    received_any = True
                    print(delta, end="", flush=True)
                    yield delta
        except groq.APITimeoutError as exc:
            raise AITimeoutError("The AI request timed out.") from exc
        except groq.RateLimitError as exc:
            raise AIRateLimitError("The AI provider rate-limited this request.") from exc
        except groq.APIConnectionError as exc:
            raise AIConnectionError("Couldn't reach the AI provider.") from exc
        except groq.APIStatusError as exc:
            raise AIProviderResponseError(f"AI provider returned an error: {exc.status_code}") from exc

        if not received_any:
            raise AIEmptyResponseError("The AI provider returned an empty response.")


groq_provider = GroqProvider()
