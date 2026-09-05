import logging
import os
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin.firestore import Client as FirestoreClient

from app.config import get_settings

logger = logging.getLogger(__name__)

_firestore_client: Optional[FirestoreClient] = None


def init_firebase() -> Optional[FirestoreClient]:
    """
    Initialize the Firebase Admin SDK once at startup.

    Reads credentials from FIREBASE_CREDENTIALS_PATH (a service-account JSON
    file). If not configured, the backend still runs — Firestore-backed
    routes simply stay inert until credentials are provided.
    """
    global _firestore_client

    settings = get_settings()

    if firebase_admin._apps:
        _firestore_client = firestore.client()
        return _firestore_client

    credentials_path = settings.firebase_credentials_path or os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

    if not credentials_path or not os.path.exists(credentials_path):
        logger.warning(
            "Firebase credentials not found — skipping Firebase Admin initialization. "
            "Set FIREBASE_CREDENTIALS_PATH to enable Firestore-backed features."
        )
        return None

    cred = credentials.Certificate(credentials_path)
    firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id or None})
    _firestore_client = firestore.client()
    logger.info("Firebase Admin SDK initialized.")
    return _firestore_client


def get_firestore_client() -> Optional[FirestoreClient]:
    return _firestore_client
