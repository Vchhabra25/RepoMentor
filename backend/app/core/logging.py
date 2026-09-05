import json
import logging
import sys
from datetime import datetime, timezone

# Attributes every LogRecord has by default — anything else attached via
# `extra={...}` is application data and gets folded into the JSON payload.
_STANDARD_RECORD_ATTRS = set(logging.LogRecord("", 0, "", 0, "", (), None).__dict__.keys())


class JSONLogFormatter(logging.Formatter):
    """
    Renders each log record as a single JSON line: timestamp, level,
    logger name, message, and any `extra={...}` fields the caller attached
    (request_id, duration_ms, repository_id, etc.). Suitable for log
    aggregation platforms (Render, Datadog, CloudWatch) that expect one
    JSON object per line.
    """

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        for key, value in record.__dict__.items():
            if key not in _STANDARD_RECORD_ATTRS and key not in payload:
                payload[key] = value

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(payload, default=str)


def configure_logging(debug: bool = True, log_format: str = "text") -> None:
    """
    Sets up logging once at startup. `log_format="json"` (used in
    production) emits structured JSON lines; `"text"` (local dev default)
    stays human-readable in a terminal.
    """
    level = logging.DEBUG if debug else logging.INFO
    handler = logging.StreamHandler(stream=sys.stdout)

    if log_format == "json":
        handler.setFormatter(JSONLogFormatter())
    else:
        handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"))

    root = logging.getLogger()
    root.setLevel(level)
    root.handlers.clear()
    root.addHandler(handler)
