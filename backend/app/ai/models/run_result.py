from dataclasses import dataclass
from datetime import datetime

from app.ai.models.responses import AgentResponseModel


@dataclass
class AgentRunResult:
    agent: str
    repository_id: str
    data: AgentResponseModel
    from_cache: bool
    generated_at: datetime
