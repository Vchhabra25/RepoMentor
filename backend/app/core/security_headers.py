from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.config import get_settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds standard security headers to every response. None of these change
    behavior for legitimate clients — they only remove footguns for
    browsers (clickjacking, MIME sniffing, referrer leakage) and are safe
    defaults for any API + SPA pairing.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"

        if get_settings().is_production:
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"

        return response
