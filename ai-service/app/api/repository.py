from fastapi import APIRouter, Depends, HTTPException
import logging

from app.schemas.repository import RepositoryIndexRequest, SearchRequest
from app.services.ingestion.repository_service import RepositoryService
from app.services.retrieval.retrieval_service import RetrievalService
from app.core.internal_auth import (
    require_embedding_config,
    require_internal_request,
    require_user_id,
)

router = APIRouter(
    prefix="/repository",
    tags=["Repository"],
)
logger = logging.getLogger(__name__)


def get_repository_service(
    embedding_config: dict = Depends(require_embedding_config),
    user_id: str = Depends(require_user_id),
):
    """Lazy dependency to create service only when needed."""
    return RepositoryService(embedding_config=embedding_config, user_id=user_id)


def get_retrieval_service(
    embedding_config: dict = Depends(require_embedding_config),
    user_id: str = Depends(require_user_id),
):
    """Lazy dependency to create service only when needed."""
    return RetrievalService(embedding_config=embedding_config, user_id=user_id)


@router.post("/index")
def index_repository(
    request: RepositoryIndexRequest,
    service = Depends(get_repository_service),
    _authorized: None = Depends(require_internal_request),
):
    try:
        result = service.index_repository(request.repository_url)

        return result

    except Exception as e:
        logger.error("Repository indexing failed without exposing provider details")
        raise HTTPException(
            status_code=500,
            detail="Repository indexing failed. Verify your embedding configuration and try again.",
        )


@router.post("/search")
def search_repository(
    request: SearchRequest,
    service = Depends(get_retrieval_service),
    _authorized: None = Depends(require_internal_request),
):
    try:
        result = service.search(
            repository_name=request.repository_name,
            query=request.query,
            top_k=request.top_k,
        )

        return result

    except Exception as e:
        logger.error("Repository search failed without exposing provider details")
        raise HTTPException(
            status_code=500,
            detail="Repository search failed. Verify your embedding configuration and try again.",
        )


@router.get("/health")
def health():
    return {"message": "Repository API is working"}
