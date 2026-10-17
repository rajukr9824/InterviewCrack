import logging

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.interview import (
    StartInterviewRequest,
    StartInterviewResponse,
    AnswerRequest,
    AnswerResponse,
    EndInterviewRequest,
    EndInterviewResponse,
)
from app.services.features.project_interview_service import (
    ProjectInterviewError,
    ProjectInterviewService,
)
from app.core.internal_auth import (
    require_gemini_key,
    require_embedding_config,
    require_internal_request,
    require_user_id,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)


def get_project_interview_service(
    x_user_gemini_key: str = Depends(require_gemini_key),
    embedding_config: dict = Depends(require_embedding_config),
    user_id: str = Depends(require_user_id),
):
    """Lazy dependency to create service only when needed."""
    return ProjectInterviewService(
        gemini_api_key=x_user_gemini_key,
        embedding_config=embedding_config,
        user_id=user_id,
    )


@router.post("/start", response_model=StartInterviewResponse)
def start_interview(
    request: StartInterviewRequest,
    service = Depends(get_project_interview_service),
    _authorized: None = Depends(require_internal_request),
):
    """
    Start a new interview session based on an indexed repository.

    The interview will generate repository-specific questions based on
    the project's codebase and implementation.
    """
    try:
        result = service.start_interview(
            repository_name=request.repository_name,
            difficulty=request.difficulty,
        )
        return StartInterviewResponse(**result)
    except ProjectInterviewError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
    except Exception as e:
        logger.error("Unexpected interview start error; provider details omitted")
        raise HTTPException(
            status_code=500,
            detail="Repository interview failed. Verify your configured Gemini key and try again.",
        )


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(
    request: AnswerRequest,
    service = Depends(get_project_interview_service),
    _authorized: None = Depends(require_internal_request),
):
    """
    Submit an answer to the current interview question.

    The system will evaluate the answer using repository context,
    provide feedback and scores, and generate follow-up questions.
    """
    try:
        result = service.submit_answer(
            session_id=request.session_id,
            answer=request.answer,
        )
        return AnswerResponse(**result)
    except ProjectInterviewError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
    except Exception as e:
        logger.error("Unexpected interview answer error; provider details omitted")
        raise HTTPException(
            status_code=500,
            detail="Repository interview failed. Verify your configured Gemini key and try again.",
        )


@router.post("/end", response_model=EndInterviewResponse)
def end_interview(
    request: EndInterviewRequest,
    service = Depends(get_project_interview_service),
    _authorized: None = Depends(require_internal_request),
):
    """
    End the interview session and receive final summary and feedback.

    This endpoint returns the overall score and comprehensive feedback.
    """
    try:
        result = service.end_interview(
            session_id=request.session_id,
        )
        return EndInterviewResponse(**result)
    except ProjectInterviewError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
    except Exception as e:
        logger.error("Unexpected interview end error; provider details omitted")
        raise HTTPException(
            status_code=500,
            detail="Repository interview failed. Verify your configured Gemini key and try again.",
        )


@router.get("/session/{session_id}")
def get_session(
    session_id: str,
    service = Depends(get_project_interview_service),
    _authorized: None = Depends(require_internal_request),
):
    """
    Get the current state of an interview session.
    """
    try:
        result = service.get_session(session_id=session_id)
        return result
    except ProjectInterviewError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
        )
    except Exception as e:
        logger.error("Unexpected interview session lookup error; provider details omitted")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while retrieving session.",
        )


@router.get("/health")
def health():
    """
    Health check endpoint for interview service.
    """
    return {"message": "Interview API is working"}
