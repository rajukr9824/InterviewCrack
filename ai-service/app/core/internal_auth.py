import hmac
from fastapi import Header

from fastapi import HTTPException

from app.core.config import settings


def require_internal_request(
    x_ai_service_secret: str | None = Header(default=None),
):
    if not settings.AI_SERVICE_INTERNAL_SECRET:
        raise HTTPException(status_code=503, detail="AI service authentication is not configured")
    if not x_ai_service_secret or not hmac.compare_digest(
        x_ai_service_secret, settings.AI_SERVICE_INTERNAL_SECRET
    ):
        raise HTTPException(status_code=401, detail="Unauthorized")


def require_gemini_key(x_user_gemini_key: str | None = Header(default=None)):
    if not x_user_gemini_key or len(x_user_gemini_key) > 512:
        raise HTTPException(
            status_code=400,
            detail="Configure a Gemini API key in your profile before using this feature.",
        )
    return x_user_gemini_key


def require_embedding_config(
    x_user_embedding_key: str | None = Header(default=None),
    x_embedding_provider: str | None = Header(default=None),
    x_embedding_model: str | None = Header(default=None),
):
    if not x_user_embedding_key or len(x_user_embedding_key) > 512:
        raise HTTPException(
            status_code=400,
            detail="Configure an embedding API key in your profile before using repository indexing.",
        )
    if x_embedding_provider != "gemini":
        raise HTTPException(status_code=400, detail="Unsupported embedding provider.")
    if x_embedding_model != "text-embedding-004":
        raise HTTPException(status_code=400, detail="Unsupported embedding model.")
    return {
        "provider": x_embedding_provider,
        "model": x_embedding_model,
        "api_key": x_user_embedding_key,
    }


def require_user_id(x_user_id: str | None = Header(default=None)):
    if not x_user_id or len(x_user_id) > 128:
        raise HTTPException(status_code=401, detail="User context is required")
    return x_user_id
