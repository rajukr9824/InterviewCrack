import logging

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.features.repository_chat_service import (
    RepositoryChatError,
    RepositoryChatService,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


def get_repository_chat_service():
    """Lazy dependency to create service only when needed."""
    return RepositoryChatService()


@router.post("/repository", response_model=ChatResponse)
def chat_with_repository(
    request: ChatRequest, service = Depends(get_repository_chat_service)
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
