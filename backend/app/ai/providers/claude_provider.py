from typing import AsyncIterator

import anthropic
from anthropic import AsyncAnthropic

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


class ClaudeProvider(AIProvider):
    """
    AIProvider backed by the Anthropic API. This is the only concrete
    provider implemented today; OpenAIProvider / GeminiProvider can be
    added later as siblings without any agent, prompt, or parser changes.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._model = settings.ai_model
        self._max_tokens = settings.ai_max_tokens
        self._timeout = settings.ai_request_timeout_seconds
        self._api_key = settings.anthropic_api_key
        self._client: AsyncAnthropic | None = (
            AsyncAnthropic(api_key=self._api_key, timeout=self._timeout) if self._api_key else None
        )

    def _require_client(self) -> AsyncAnthropic:
        if self._client is None:
            raise AIConfigurationError(
                "ANTHROPIC_API_KEY is not set. Configure it to enable AI-powered endpoints."
            )
        return self._client

    async def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        client = self._require_client()
        try:
            message = await client.messages.create(
                model=self._model,
                max_tokens=self._max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
        except anthropic.APITimeoutError as exc:
            raise AITimeoutError("The AI request timed out.") from exc
        except anthropic.RateLimitError as exc:
            raise AIRateLimitError("The AI provider rate-limited this request.") from exc
        except anthropic.APIConnectionError as exc:
            raise AIConnectionError("Couldn't reach the AI provider.") from exc
        except anthropic.APIStatusError as exc:
            raise AIProviderResponseError(f"AI provider returned an error: {exc.status_code}") from exc

        text = "".join(block.text for block in message.content if block.type == "text")
        if not text.strip():
            raise AIEmptyResponseError("The AI provider returned an empty response.")
        return text

    async def stream(self, *, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        client = self._require_client()
        received_any = False
        try:
            async with client.messages.stream(
                model=self._model,
                max_tokens=self._max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            ) as stream:
                async for text in stream.text_stream:
                    if text:
                        received_any = True
                        yield text
        except anthropic.APITimeoutError as exc:
            raise AITimeoutError("The AI request timed out.") from exc
        except anthropic.RateLimitError as exc:
            raise AIRateLimitError("The AI provider rate-limited this request.") from exc
        except anthropic.APIConnectionError as exc:
            raise AIConnectionError("Couldn't reach the AI provider.") from exc
        except anthropic.APIStatusError as exc:
            raise AIProviderResponseError(f"AI provider returned an error: {exc.status_code}") from exc

        if not received_any:
            raise AIEmptyResponseError("The AI provider returned an empty response.")


claude_provider = ClaudeProvider()
