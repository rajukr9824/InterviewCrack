from pydantic import BaseModel
from typing import List


class RepositoryIndexRequest(BaseModel):
    repository_url: str


class SourceFile(BaseModel):
    file_name: str
    path: str
    language: str


class RepositoryIndexResponse(BaseModel):
    repository_name: str
    total_files: int
    files: List[SourceFile]


class SearchRequest(BaseModel):
    repository_name: str
    query: str
    top_k: int = 5