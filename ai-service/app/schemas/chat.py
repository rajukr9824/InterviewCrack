from typing import List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    repository_name: str = Field(
        ...,
        description="Indexed repository name used for retrieval.",
    )
    question: str = Field(
        ...,
        description="Natural language question about the repository.",
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=1,
        le=20,
        description="Optional number of chunks to retrieve.",
    )


class SourceReference(BaseModel):
    file_name: str
    path: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceReference] = Field(default_factory=list)
