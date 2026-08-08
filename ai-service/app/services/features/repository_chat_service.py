import logging
import re
from typing import Dict, List, Optional

from app.core.config import settings
from app.services.indexing.vector_store_service import VectorStoreService
from app.services.llm.llm_service import LLMService
from app.services.llm.prompt_service import PromptService
from app.services.retrieval.retrieval_service import RetrievalService

logger = logging.getLogger(__name__)


class RepositoryChatError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class RepositoryChatService:
    """
    Orchestrates repository-grounded Q&A on top of retrieval and LLM services.
    """

    _REPOSITORY_NAME_PATTERN = re.compile(r"^[A-Za-z0-9._-]{1,120}$")

    def __init__(
        self,
        retrieval_service: Optional[RetrievalService] = None,
        prompt_service: Optional[PromptService] = None,
        llm_service: Optional[LLMService] = None,
        vector_store_service: Optional[VectorStoreService] = None,
    ):
        self.retrieval_service = retrieval_service or RetrievalService()
        self.prompt_service = prompt_service or PromptService()
        self.llm_service = llm_service or LLMService()
        self.vector_store_service = vector_store_service or VectorStoreService()
        self.default_top_k = settings.CHAT_TOP_K

    def chat(
        self, repository_name: str, question: str, top_k: Optional[int] = None
    ) -> Dict:
        repository_name = (repository_name or "").strip()
        question = (question or "").strip()

        self._validate_repository_name(repository_name)
        self._validate_question(question)

        effective_top_k = top_k if top_k is not None else self.default_top_k
        if effective_top_k < 1 or effective_top_k > 20:
            raise RepositoryChatError(
                "top_k must be between 1 and 20.", status_code=422
            )

        if not self.vector_store_service.has_index(repository_name):
            raise RepositoryChatError(
                f"Repository '{repository_name}' is not indexed or index files are missing.",
                status_code=404,
            )

        retrieval_result = self.retrieval_service.search(
            repository_name=repository_name,
            query=question,
            top_k=effective_top_k,
        )

        chunks = retrieval_result.get("results") or []
        if not chunks:
            return {
                "answer": "I could not find relevant information for this question in the indexed repository context.",
                "sources": [],
            }

        prompt = self.prompt_service.build_repository_chat_prompt(
            repository_name=repository_name,
            question=question,
            retrieved_chunks=chunks,
        )

        try:
            answer = self.llm_service.generate_response(prompt=prompt)
        except Exception as e:
            logger.error(f"Repository chat LLM failure for {repository_name}: {e}")
            raise RepositoryChatError(
                "Failed to generate answer from LLM.",
                status_code=502,
            ) from e

        if not answer.strip():
            answer = (
                "I could not produce an answer from the retrieved repository context."
            )

        return {
            "answer": answer,
            "sources": self._build_sources(chunks),
        }

    def _validate_repository_name(self, repository_name: str) -> None:
        if not repository_name:
            raise RepositoryChatError("repository_name is required.", status_code=422)

        if not self._REPOSITORY_NAME_PATTERN.fullmatch(repository_name):
            raise RepositoryChatError(
                "Invalid repository_name. Use only letters, numbers, dot, underscore, or hyphen.",
                status_code=422,
            )

    def _validate_question(self, question: str) -> None:
        if not question:
            raise RepositoryChatError("question is required.", status_code=422)

    def _build_sources(self, chunks: List[Dict]) -> List[Dict]:
        unique_sources = []
        seen_paths = set()

        for chunk in chunks:
            path = (chunk.get("path") or "").strip()
            file_name = (chunk.get("file_name") or "").strip()

            if not path or not file_name:
                continue

            if path in seen_paths:
                continue

            seen_paths.add(path)
            unique_sources.append(
                {
                    "file_name": file_name,
                    "path": path,
                }
            )

        return unique_sources
