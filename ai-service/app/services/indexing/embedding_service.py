import logging
from typing import Dict, List
import sys

from app.core.config import settings

logger = logging.getLogger(__name__)
logger.info(f"Embedding service module loaded, Python path: {sys.executable}")


class EmbeddingService:
    """
    Service responsible for generating vector embeddings from semantic code chunks.
    """

    def __init__(self):
        self.provider = settings.DEFAULT_PROVIDER
        self.model = settings.EMBEDDING_MODEL
        self.batch_size = settings.EMBEDDING_BATCH_SIZE
        self._client = None

    @property
    def client(self):
        """Lazy load genai.Client to avoid slow import."""
        if self._client is None:
            try:
                from google import genai

                if self.provider == "gemini":
                    if not settings.GEMINI_API_KEY:
                        raise RuntimeError(
                            "GEMINI_API_KEY is not set. "
                            "Please configure it in your .env file."
                        )
                    self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
                    logger.info("Gemini client initialized successfully.")
                else:
                    raise RuntimeError(
                        f"Unsupported embedding provider: '{self.provider}'. "
                        "Only 'gemini' is currently supported."
                    )
            except RuntimeError:
                raise
            except Exception as e:
                raise RuntimeError(
                    f"Failed to initialize embedding client for provider '{self.provider}': {e}"
                ) from e
        return self._client

    def generate_embeddings(self, chunks: List[Dict]) -> List[Dict]:
        """
        Accepts a list of chunks, generates embeddings using the configured LLM provider,
        and returns the chunks augmented with the 'embedding' field.

        Args:
            chunks: A list of dictionaries, each containing chunk metadata and content.

        Returns:
            A new list of chunk dictionaries with the 'embedding' field populated.
        """
        logger.info(f"generate_embeddings called with {len(chunks)} chunks")
        
        if not chunks:
            return []

        # Access client property to trigger lazy initialization (raises on failure)
        client = self.client

        embedded_chunks = []
        logger.info(f"Using embedding model: {self.model}")
        logger.info(f"Provider: {self.provider}")
        logger.info(f"Batch size: {self.batch_size}")

        # Process chunks in batches to optimize API calls
        for i in range(0, len(chunks), self.batch_size):
            batch = chunks[i : i + self.batch_size]
            contents = [chunk.get("content", "") for chunk in batch]
            logger.info(f"Processing batch {i} to {i + len(batch)}, content count: {len(contents)}")

            try:
                response = self.client.models.embed_content(
                    model=self.model,
                    contents=contents,
                )
                embeddings = response.embeddings
                logger.info(f"Got {len(embeddings)} embeddings from API")

                # Assign embeddings back to chunks
                for chunk, embedding_obj in zip(batch, embeddings):
                    new_chunk = chunk.copy()

                    if self.provider == "gemini":
                        if hasattr(embedding_obj, 'values'):
                            new_chunk["embedding"] = list(embedding_obj.values)
                            logger.info(f"Added embedding with {len(new_chunk['embedding'])} dimensions")
                        else:
                            logger.error(f"embedding_obj has no 'values' attribute: {type(embedding_obj)}")

                    embedded_chunks.append(new_chunk)

            except Exception as e:
                logger.error(
                    f"Error generating embeddings for batch {i} to {i + self.batch_size}: {e}"
                )
                import traceback
                logger.error(traceback.format_exc())
                # Re-raise the exception to halt the pipeline
                raise

        logger.info(f"Total embedded_chunks returned: {len(embedded_chunks)}")
        return embedded_chunks
