import logging

from fastapi import APIRouter, Depends, HTTPException

from app.core.internal_auth import (
    require_embedding_config,
    require_internal_request,
    require_user_id,
)
from app.services.indexing.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/embedding", tags=["Embedding"])


@router.post("/test")
def test_embedding(
    embedding_config: dict = Depends(require_embedding_config),
    _user_id: str = Depends(require_user_id),
    _authorized: None = Depends(require_internal_request),
):
    try:
        service = EmbeddingService(
            api_key=embedding_config["api_key"],
            provider=embedding_config["provider"],
            model=embedding_config["model"],
        )
        result = service.generate_embeddings([{"content": "embedding configuration test"}])
        if not result or not result[0].get("embedding"):
            raise RuntimeError("The provider returned an empty embedding.")
        return {
            "message": "Embedding configuration is valid.",
            "provider": embedding_config["provider"],
            "model": embedding_config["model"],
            "dimension": len(result[0]["embedding"]),
        }
    except Exception:
        logger.error("Embedding configuration test failed; provider details omitted")
        raise HTTPException(
            status_code=502,
            detail="Embedding configuration test failed. Verify the provider key and model.",
        )
