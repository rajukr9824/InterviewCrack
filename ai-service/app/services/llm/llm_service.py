import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """
    Shared service for text generation from the configured LLM provider.
    """

    def __init__(self):
        self.provider = settings.DEFAULT_PROVIDER
        self.model = settings.CHAT_MODEL
        self._client = None

    @property
    def client(self):
        """Lazy load genai.Client to avoid slow import."""
        if self._client is None:
            from google import genai

            if self.provider == "gemini":
                if settings.GEMINI_API_KEY:
                    self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
                else:
                    logger.warning("GEMINI_API_KEY is not configured for chat generation.")
            else:
                self._client = None
        return self._client

    def generate_response(
        self,
        prompt: str,
        temperature: float = 0.2,
        max_output_tokens: int = 900,
    ) -> str:
        """
        Generate a text response for a given prompt.
        """
        if not prompt or not prompt.strip():
            raise ValueError("Prompt is empty.")

        if self.provider != "gemini":
            raise RuntimeError(f"Unsupported LLM provider: {self.provider}")

        if not self.client:
            raise RuntimeError("LLM provider is not configured.")

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "temperature": temperature,
                    "max_output_tokens": max_output_tokens,
                },
            )
        except Exception as e:
            logger.error(f"LLM generation failed: {e}")
            raise RuntimeError("Failed to generate response from LLM.") from e

        text = getattr(response, "text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()

        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", None) or []
            collected = []

            for part in parts:
                part_text = getattr(part, "text", None)
                if isinstance(part_text, str) and part_text.strip():
                    collected.append(part_text.strip())

            if collected:
                return "\n".join(collected)

        raise RuntimeError("LLM returned an empty response.")
