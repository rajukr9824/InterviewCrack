import logging
import os
import shutil
import sys
from typing import Dict, List

from git import Repo

from app.core.config import settings
from app.services.indexing.parser_service import ParserService
from app.services.indexing.chunk_service import ChunkService
from app.services.indexing.embedding_service import EmbeddingService
from app.services.indexing.vector_store_service import VectorStoreService

logger = logging.getLogger(__name__)
logger.info(f"Repository service module loaded, Python path: {sys.executable}")


class RepositoryService:
    def __init__(self):
        self.parser_service = ParserService()
        self.chunk_service = ChunkService()
        self.embedding_service = EmbeddingService()
        self.vector_store_service = VectorStoreService()

    def clone_repository(self, repository_url: str) -> str:
        """
        Clone repository only if it doesn't already exist.
        """

        repository_name = repository_url.rstrip("/").split("/")[-1]

        repository_path = os.path.join(
            settings.REPOSITORY_STORAGE_PATH,
            repository_name,
        )

        if os.path.exists(repository_path):
            return repository_path

        Repo.clone_from(
            repository_url,
            repository_path,
        )

        return repository_path

    def remove_existing_repository(self, repository_path: str):
        """
        Delete repository if it already exists.
        """

        if os.path.exists(repository_path):
            shutil.rmtree(repository_path)

    def should_ignore(self, directory_name: str) -> bool:
        return directory_name in settings.IGNORED_DIRECTORIES

    def get_language(self, file_name: str, file_extension: str) -> str:
        name_lower = file_name.lower()
        if name_lower == "dockerfile" or name_lower.endswith("dockerfile"):
            return "Dockerfile"
        if name_lower == "makefile":
            return "Makefile"
        if name_lower in ["license", "authors", "changelog"]:
            return "Text"

        language_map = {
            ".py": "Python",
            ".js": "JavaScript",
            ".ts": "TypeScript",
            ".tsx": "TSX",
            ".jsx": "JSX",
            ".java": "Java",
            ".json": "JSON",
            ".yml": "YAML",
            ".yaml": "YAML",
            ".md": "Markdown",
            ".txt": "Text",
            ".sh": "Shell",
        }

        return language_map.get(file_extension.lower(), "Unknown")

    def collect_source_files(self, repository_path: str):
        source_files = []

        for root, directories, files in os.walk(repository_path):

            directories[:] = [
                directory
                for directory in directories
                if not self.should_ignore(directory)
            ]

            for file in files:
                file_extension = os.path.splitext(file)[1]

                is_supported_extension = file_extension in settings.SUPPORTED_EXTENSIONS
                is_supported_name = file.lower() in [
                    "dockerfile",
                    "makefile",
                    "license",
                ]

                if not (is_supported_extension or is_supported_name):
                    continue

                absolute_path = os.path.abspath(os.path.join(root, file))
                relative_path = os.path.relpath(
                    absolute_path, os.path.abspath(repository_path)
                )
                # Ensure using forward slashes for relative paths to stay consistent across OS
                relative_path = relative_path.replace("\\", "/")

                source_files.append(
                    {
                        "file_name": file,
                        "path": relative_path,
                        "absolute_path": absolute_path,
                        "language": self.get_language(file, file_extension),
                    }
                )

        return source_files

    def index_repository(self, repository_url: str):
        logger.info(f"Starting repository indexing for URL: {repository_url}")
        
        repository_path = self.clone_repository(repository_url)
        logger.info(f"Cloned repository to: {repository_path}")

        source_files = self.collect_source_files(repository_path)
        logger.info(f"Collected {len(source_files)} source files")

        parsed_files = self.parser_service.parse_files(source_files)
        logger.info(f"Parsed {len(parsed_files)} files")

        chunks = self.chunk_service.create_chunks(parsed_files)
        logger.info(f"Created {len(chunks)} chunks")
        
        # Remove absolute_path so it doesn't propagate further
        for p in parsed_files:
            p.pop("absolute_path", None)

        # Generate embeddings for the chunks
        logger.info("Starting embedding generation...")
        embedded_chunks = self.embedding_service.generate_embeddings(chunks)
        logger.info(f"Got {len(embedded_chunks)} embedded chunks")
        
        # Extract repository_name early for error messages
        repository_name = os.path.basename(repository_path)
        logger.info(f"Repository name: {repository_name}")
        
        # Verify embeddings were generated
        if not embedded_chunks:
            raise RuntimeError(
                f"No embeddings were generated for repository {repository_name}. "
                "Check if the embedding service is configured correctly."
            )

        # Verify each chunk has an embedding
        chunks_with_embeddings = [c for c in embedded_chunks if "embedding" in c]
        logger.info(f"Chunks with 'embedding' field: {len(chunks_with_embeddings)}")
        
        if len(chunks_with_embeddings) == 0:
            raise RuntimeError(
                f"No chunks have embeddings for repository {repository_name}. "
                f"Generated {len(embedded_chunks)} chunks but none have 'embedding' field."
            )
        
        # Build the FAISS index and save it along with metadata
        logger.info("Building and saving FAISS index...")
        save_success = self.vector_store_service.build_and_save_index(
            repository_name, embedded_chunks
        )
        
        if not save_success:
            raise RuntimeError(
                f"Failed to save FAISS index for repository {repository_name}. "
                "Check logs for more details."
            )

        logger.info("Repository indexing completed successfully")
        return {
            "repository_name": repository_name,
            "total_files": len(source_files),
            "message": "Repository indexed successfully.",
        }


