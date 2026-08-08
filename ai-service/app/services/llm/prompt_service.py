from typing import Dict, List

from app.core.config import settings


class PromptService:
    """
    Responsible for constructing prompts used by LLM-based features.
    """

    def __init__(self):
        self.max_context_chars = settings.CHAT_MAX_CONTEXT_CHARS
        self.max_chunk_chars = settings.CHAT_MAX_CHUNK_CHARS

    def build_repository_chat_prompt(
        self,
        repository_name: str,
        question: str,
        retrieved_chunks: List[Dict],
    ) -> str:
        """
        Build a repository-aware prompt that constrains the model to retrieved context.
        """
        context_blocks = []
        consumed_chars = 0

        for idx, chunk in enumerate(retrieved_chunks, start=1):
            file_name = chunk.get("file_name", "Unknown")
            path = chunk.get("path", "Unknown")
            content = (chunk.get("content") or "").strip()

            if not content:
                continue

            if len(content) > self.max_chunk_chars:
                content = content[: self.max_chunk_chars].rstrip() + "\n... [truncated]"

            block = (
                f"[Chunk {idx}]\n"
                f"File: {file_name}\n"
                f"Path: {path}\n"
                f"Code:\n{content}\n"
            )

            if consumed_chars + len(block) > self.max_context_chars:
                break

            context_blocks.append(block)
            consumed_chars += len(block)

        context_text = (
            "\n".join(context_blocks)
            if context_blocks
            else "No repository context was retrieved."
        )

        return (
            "You are a repository assistant for software engineers.\n"
            "You must answer using only the provided repository context.\n"
            "Do not invent code, files, classes, or behavior not present in context.\n"
            "If the answer is not found in context, clearly say that the repository context does not contain enough information.\n"
            "When relevant, mention file paths from the context.\n\n"
            f"Repository: {repository_name}\n\n"
            "Retrieved Repository Context:\n"
            f"{context_text}\n\n"
            "User Question:\n"
            f"{question}\n\n"
            "Return a concise and accurate answer grounded in the context above."
        )
