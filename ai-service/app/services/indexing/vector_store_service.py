import os
import json
import logging
import numpy as np
from typing import Dict, List, Optional, Tuple

import faiss
from app.core.config import settings

logger = logging.getLogger(__name__)


class VectorStoreService:
    def __init__(self):
        self.store_path = settings.VECTOR_STORE_PATH
        os.makedirs(self.store_path, exist_ok=True)

    def _get_index_path(self, repository_name: str) -> str:
        return os.path.join(self.store_path, f"{repository_name}.index")

    def _get_metadata_path(self, repository_name: str) -> str:
        return os.path.join(self.store_path, f"{repository_name}_metadata.json")

    def has_index(self, repository_name: str) -> bool:
        """
        Returns True when both FAISS index and metadata files exist for a repository.
        """
        index_path = self._get_index_path(repository_name)
        metadata_path = self._get_metadata_path(repository_name)
        return os.path.exists(index_path) and os.path.exists(metadata_path)

    def build_and_save_index(
        self, repository_name: str, embedded_chunks: List[Dict]
    ) -> bool:
        """
        Builds a FAISS index from the provided embeddings and saves the index and metadata to disk.
        """
        if not embedded_chunks:
            logger.warning(f"No embeddings provided to index for {repository_name}")
            return False

        try:
            # Determine dimension from the first valid embedding
            dimension = None
            for chunk in embedded_chunks:
                emb = chunk.get("embedding")
                if emb:
                    dimension = len(emb)
                    break

            if not dimension:
                logger.error(
                    f"No valid embeddings found in chunks for {repository_name}. Aborting."
                )
                return False

            index = faiss.IndexFlatL2(dimension)

            embeddings_matrix = []
            metadata_list = []

            faiss_id_counter = 0

            for chunk in embedded_chunks:
                emb = chunk.get("embedding")
                if not emb or len(emb) != dimension:
                    logger.warning(
                        f"Skipping chunk {chunk.get('chunk_id')} due to invalid or missing embedding."
                    )
                    continue

                embeddings_matrix.append(emb)

                # Copy metadata and exclude the actual vector from the metadata file to save space
                metadata = chunk.copy()
                metadata.pop("embedding", None)
                metadata["faiss_id"] = faiss_id_counter
                metadata["repository_name"] = repository_name
                metadata_list.append(metadata)

                faiss_id_counter += 1

            if not embeddings_matrix:
                logger.error(
                    f"No valid embeddings available to add to FAISS for {repository_name}"
                )
                return False

            # Add to FAISS index
            vectors = np.array(embeddings_matrix).astype("float32")
            index.add(vectors)

            # Save FAISS Index
            index_path = self._get_index_path(repository_name)
            faiss.write_index(index, index_path)

            # Save Metadata
            metadata_path = self._get_metadata_path(repository_name)
            with open(metadata_path, "w", encoding="utf-8") as f:
                json.dump(metadata_list, f, indent=4)

            logger.info(
                f"Successfully saved FAISS index and metadata for {repository_name} with {len(metadata_list)} vectors."
            )
            return True

        except Exception as e:
            logger.error(f"Error building vector store for {repository_name}: {e}")
            return False

    def load_index(
        self, repository_name: str
    ) -> Optional[Tuple[faiss.Index, List[Dict]]]:
        """
        Loads the FAISS index and metadata for a given repository.
        """
        index_path = self._get_index_path(repository_name)
        metadata_path = self._get_metadata_path(repository_name)

        if not os.path.exists(index_path) or not os.path.exists(metadata_path):
            logger.error(
                f"Index or metadata not found for repository: {repository_name}"
            )
            return None

        try:
            index = faiss.read_index(index_path)

            with open(metadata_path, "r", encoding="utf-8") as f:
                metadata = json.load(f)

            return index, metadata
        except Exception as e:
            logger.error(f"Failed to load vector store for {repository_name}: {e}")
            return None
