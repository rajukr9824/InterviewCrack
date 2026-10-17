import hmac

from fastapi import Header, HTTPException

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
