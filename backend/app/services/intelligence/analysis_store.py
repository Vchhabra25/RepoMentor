import logging
from typing import Dict, Optional

from app.firebase import get_firestore_client
from app.models import RepositoryAnalysis

logger = logging.getLogger(__name__)

FIRESTORE_COLLECTION = "repository_analysis"


class AnalysisStore:
    """
    Persists Repository Intelligence Engine output.

    Mirrors RepositoryService's storage pattern: an in-memory dict is the
    source of truth for reads (fast, always available), and every write is
    best-effort mirrored to Firestore when Firebase Admin is configured —
    the same seam RepositoryService documents for swapping in real
    persistence later.
    """

    def __init__(self) -> None:
        self._cache: Dict[str, RepositoryAnalysis] = {}

    def save(self, analysis: RepositoryAnalysis) -> None:
        self._cache[analysis.repository_id] = analysis
        self._persist_to_firestore(analysis)

    def get(self, repository_id: str) -> Optional[RepositoryAnalysis]:
        return self._cache.get(repository_id)

    def _persist_to_firestore(self, analysis: RepositoryAnalysis) -> None:
        client = get_firestore_client()
        if client is None:
            return
        try:
            client.collection(FIRESTORE_COLLECTION).document(analysis.repository_id).set(
                analysis.model_dump(mode="json")
            )
        except Exception:
            logger.warning("Failed to persist repository analysis to Firestore.", exc_info=True)


analysis_store = AnalysisStore()
