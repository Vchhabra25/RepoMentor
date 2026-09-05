import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app.errors")


def _request_id(request: Request) -> str | None:
    return getattr(request.state, "request_id", None)


def _error_response(status_code: int, message: str, *, code: str, request: Request, **extra: object) -> JSONResponse:
    """
    Every error response includes `detail` (the field the frontend already
    reads — see frontend/src/services/api.ts `parseErrorMessage`) so no
    existing error handling breaks, plus a stable `error_code` and
    `request_id` for anything that wants to key off them later.
    """
    body = {"detail": message, "error_code": code, "request_id": _request_id(request)}
    body.update(extra)
    return JSONResponse(status_code=status_code, content=body)


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return _error_response(
        exc.status_code,
        str(exc.detail),
        code=f"http_{exc.status_code}",
        request=request,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return _error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "The request didn't match the expected shape.",
        code="validation_error",
        request=request,
        fields=[{"loc": list(err["loc"]), "message": err["msg"]} for err in exc.errors()],
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Full traceback goes to logs only — never to the client. Stack traces
    # can leak file paths, internal structure, and (for AI routes) prompt
    # content; none of that belongs in an HTTP response.
    logger.exception(
        "unhandled_exception",
        extra={"request_id": _request_id(request), "path": request.url.path, "method": request.method},
    )
    return _error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "An unexpected error occurred. Please try again.",
        code="internal_error",
        request=request,
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
