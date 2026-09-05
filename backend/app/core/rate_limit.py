import logging
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.config import get_settings

logger = logging.getLogger("app.rate_limit")

WINDOW_SECONDS = 60.0
_CLEANUP_EVERY_N_REQUESTS = 500


class InMemoryRateLimiter:
    """
    A simple sliding-window rate limiter, keyed by client IP.

    This is intentionally in-memory and single-process — it resets on
    restart and doesn't coordinate across multiple instances. That's a
    real limitation for a horizontally-scaled deployment (swap in Redis
    there), but it's an honest, dependency-free fit for the single-instance
    Render deployment this project targets.
    """

    def __init__(self, general_limit: int, ai_limit: int) -> None:
        self.general_limit = general_limit
        self.ai_limit = ai_limit
        self._general: Dict[str, Deque[float]] = defaultdict(deque)
        self._ai: Dict[str, Deque[float]] = defaultdict(deque)
        self._request_count = 0

    def check(self, client_key: str, *, is_ai_path: bool) -> bool:
        self._request_count += 1
        if self._request_count % _CLEANUP_EVERY_N_REQUESTS == 0:
            self._cleanup()

        bucket = self._ai if is_ai_path else self._general
        limit = self.ai_limit if is_ai_path else self.general_limit
        return self._is_allowed(bucket, client_key, limit)

    @staticmethod
    def _is_allowed(bucket: Dict[str, Deque[float]], key: str, limit: int) -> bool:
        now = time.monotonic()
        timestamps = bucket[key]
        while timestamps and now - timestamps[0] > WINDOW_SECONDS:
            timestamps.popleft()
        if len(timestamps) >= limit:
            return False
        timestamps.append(now)
        return True

    def _cleanup(self) -> None:
        """Drops empty per-client deques so long-lived processes don't leak memory."""
        for bucket in (self._general, self._ai):
            stale = [key for key, timestamps in bucket.items() if not timestamps]
            for key in stale:
                del bucket[key]


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        settings = get_settings()
        self._enabled = settings.rate_limit_enabled
        self._limiter = InMemoryRateLimiter(
            general_limit=settings.rate_limit_requests_per_minute,
            ai_limit=settings.rate_limit_ai_requests_per_minute,
        )

    async def dispatch(self, request: Request, call_next) -> Response:
        if not self._enabled or request.url.path in ("/api/health", "/api/ready"):
            return await call_next(request)

        client_key = self._client_key(request)
        is_ai_path = "/ai/" in request.url.path

        if not self._limiter.check(client_key, is_ai_path=is_ai_path):
            logger.warning("rate_limit_exceeded", extra={"client": client_key, "path": request.url.path})
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down and try again shortly."},
                headers={"Retry-After": "60"},
            )

        return await call_next(request)

    @staticmethod
    def _client_key(request: Request) -> str:
        # Only trust X-Forwarded-For when running behind a known reverse proxy
        # (Render terminates TLS and forwards this header reliably).
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"
