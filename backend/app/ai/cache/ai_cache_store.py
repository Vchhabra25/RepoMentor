import hashlib
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, Optional

from app.ai.context_utils import to_json
from app.ai.models.responses import AgentResponseModel
from app.firebase import get_firestore_client
from app.models import RepositoryAnalysis

logger = logging.getLogger(__name__)

FIRESTORE_COLLECTION = "ai_agent_cache"


def repository_fingerprint(analysis: RepositoryAnalysis) -> str:
    """
    A deterministic fingerprint of "what the repository looked like" when
    this analysis was generated. As long as re-running the Intelligence
    Engine produces the same summary/health/dependency graph, this stays
    stable — so AI agent output can be safely reused instead of re-calling
    the LLM for an unchanged repository.
    """
    fingerprint_source = to_json(analysis.summary) + to_json(analysis.health) + to_json(analysis.dependency_graph)
    return hashlib.sha256(fingerprint_source.encode("utf-8")).hexdigest()


@dataclass
class CachedAgentOutput:
    data: AgentResponseModel
    generated_at: datetime
    fingerprint: str


class AICacheStore:
    """
    Caches AI agent outputs. Same storage pattern as AnalysisStore and
    RepositoryService: in-memory is the source of truth for reads, writes
    are best-effort mirrored to Firestore when configured.

    Cache key: (repository_id, agent_name, extra_key, fingerprint) — the
    fingerprint means a re-analyzed (changed) repository naturally misses
    the cache instead of serving stale AI output.
    """

    def __init__(self) -> None:
        self._cache: Dict[str, CachedAgentOutput] = {}

    @staticmethod
    def _key(repository_id: str, agent_name: str, extra_key: str, fingerprint: str) -> str:
        return f"{repository_id}:{agent_name}:{extra_key}:{fingerprint}"

    def get(
        self, *, repository_id: str, agent_name: str, fingerprint: str, extra_key: str = ""
    ) -> Optional[CachedAgentOutput]:
        return self._cache.get(self._key(repository_id, agent_name, extra_key, fingerprint))

    def set(
        self,
        *,
        repository_id: str,
        agent_name: str,
        fingerprint: str,
        data: AgentResponseModel,
        extra_key: str = "",
    ) -> CachedAgentOutput:
        entry = CachedAgentOutput(data=data, generated_at=datetime.now(timezone.utc), fingerprint=fingerprint)
        self._cache[self._key(repository_id, agent_name, extra_key, fingerprint)] = entry
        self._persist_to_firestore(repository_id, agent_name, extra_key, entry)
        return entry

    def _persist_to_firestore(self, repository_id: str, agent_name: str, extra_key: str, entry: CachedAgentOutput) -> None:
        client = get_firestore_client()
        if client is None:
            return
        try:
            doc_id = f"{repository_id}_{agent_name}_{extra_key or 'default'}"
            client.collection(FIRESTORE_COLLECTION).document(doc_id).set(
                {
                    "repository_id": repository_id,
                    "agent_name": agent_name,
                    "extra_key": extra_key,
                    "fingerprint": entry.fingerprint,
                    "generated_at": entry.generated_at.isoformat(),
                    "data": entry.data.model_dump(mode="json"),
                }
            )
        except Exception:
            logger.warning("Failed to persist AI agent output to Firestore.", exc_info=True)


ai_cache_store = AICacheStore()
