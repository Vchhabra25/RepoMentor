class AIError(Exception):
    """Base class for every error raised by the AI layer."""


class AIConfigurationError(AIError):
    """Raised when the AI provider isn't configured (e.g. missing API key)."""


class AITimeoutError(AIError):
    """Raised when the LLM request exceeds the configured timeout."""


class AIRateLimitError(AIError):
    """Raised when the LLM provider rate-limits the request."""


class AIConnectionError(AIError):
    """Raised on network failure reaching the LLM provider."""


class AIEmptyResponseError(AIError):
    """Raised when the LLM returns no usable content."""


class AIProviderResponseError(AIError):
    """Raised for any other non-2xx response from the LLM provider."""


class AIParsingError(AIError):
    """
    Raised when an agent's parser can't turn the LLM's raw text into its
    structured response model. Never trust raw LLM text — this is the
    boundary where that trust ends.
    """
