from fastapi import APIRouter

from app.api import ai, analyze, github, health, intelligence, repository, upload

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
api_router.include_router(upload.router)
api_router.include_router(github.router)
api_router.include_router(repository.router)
api_router.include_router(intelligence.router)
api_router.include_router(ai.router)
api_router.include_router(analyze.router)

__all__ = ["api_router"]
