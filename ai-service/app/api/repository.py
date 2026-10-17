from fastapi import APIRouter, Depends, HTTPException

from app.schemas.repository import RepositoryIndexRequest, SearchRequest
from app.services.ingestion.repository_service import RepositoryService
from app.services.retrieval.retrieval_service import RetrievalService
from app.core.internal_auth import require_gemini_key, require_internal_request

router = APIRouter(
    prefix="/repository",
    tags=["Repository"],
)


def get_repository_service(
    x_user_gemini_key: str = Depends(require_gemini_key),
):
    """Lazy dependency to create service only when needed."""
    return RepositoryService(gemini_api_key=x_user_gemini_key)


def get_retrieval_service(
    x_user_gemini_key: str = Depends(require_gemini_key),
):
    """Lazy dependency to create service only when needed."""
    return RetrievalService(gemini_api_key=x_user_gemini_key)


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
        raise HTTPException(
            status_code=500,
            detail=str(e),
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
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/health")
def health():
    return {"message": "Repository API is working"}
