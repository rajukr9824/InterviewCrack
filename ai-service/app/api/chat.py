import logging

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.features.repository_chat_service import (
    RepositoryChatError,
    RepositoryChatService,
)
from app.core.internal_auth import require_gemini_key, require_internal_request

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


def get_repository_chat_service(
    x_user_gemini_key: str = Depends(require_gemini_key),
):
    """Lazy dependency to create service only when needed."""
    return RepositoryChatService(gemini_api_key=x_user_gemini_key)


@router.post("/repository", response_model=ChatResponse)
def chat_with_repository(
    request: ChatRequest,
    service = Depends(get_repository_chat_service),
    _authorized: None = Depends(require_internal_request),
):
    try:
        result = service.chat(
            repository_name=request.repository_name,
            question=request.question,
            top_k=request.top_k,
        )
        return ChatResponse(**result)
    except RepositoryChatError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
    except Exception as e:
        logger.exception(f"Unexpected chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while processing repository chat request.",
        )
