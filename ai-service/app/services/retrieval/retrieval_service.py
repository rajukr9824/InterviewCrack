import logging
import numpy as np
from typing import Dict

from app.services.indexing.embedding_service import EmbeddingService
from app.services.indexing.vector_store_service import VectorStoreService

logger = logging.getLogger(__name__)


class RetrievalService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_store_service = VectorStoreService()

    def search(self, repository_name: str, query: str, top_k: int = 5) -> Dict:
        """
        Accepts a natural language query, generates its embedding,
        searches the FAISS index, and returns the top-K relevant chunks with metadata.
        """
        if not query or not query.strip():
            logger.warning("Empty query provided for search.")
            return {"query": query, "results": []}
            
        if not repository_name:
            logger.warning("Empty repository_name provided for search.")
            return {"query": query, "results": []}

        # 1. Generate Query Embedding
        try:
            # We wrap the query in a dictionary as EmbeddingService expects a list of chunks
            query_chunk = [{"content": query}]
            embedded_query_chunks = self.embedding_service.generate_embeddings(query_chunk)
            
            if not embedded_query_chunks or "embedding" not in embedded_query_chunks[0]:
                logger.error("Failed to generate embedding for the query.")
                return {"query": query, "results": []}
                
            query_embedding = embedded_query_chunks[0]["embedding"]
        except Exception as e:
            logger.error(f"Error generating query embedding: {e}")
            return {"query": query, "results": []}

        # 2. Load FAISS Index and Metadata
        store_data = self.vector_store_service.load_index(repository_name)
        if not store_data:
            logger.error(f"Could not load vector store for {repository_name}")
            return {"query": query, "results": []}
            
        index, metadata_list = store_data

        if index.ntotal == 0:
            logger.warning(f"FAISS index for {repository_name} is empty.")
            return {"query": query, "results": []}

        # Validate dimension matches
        if len(query_embedding) != index.d:
            logger.error(f"Dimension mismatch: Query ({len(query_embedding)}) vs Index ({index.d})")
            return {"query": query, "results": []}

        # 3. Perform Semantic Search
        try:
            # FAISS expects a 2D numpy array of float32
            query_vector = np.array([query_embedding]).astype('float32')
            
            # search returns distances (L2) and indices (faiss_id)
            k = min(top_k, index.ntotal)
            distances, indices = index.search(query_vector, k)
        except Exception as e:
            logger.error(f"Error during FAISS similarity search: {e}")
            return {"query": query, "results": []}

        # 4. Retrieve Metadata
        results = []
        # distances and indices are 2D arrays, we take the first (and only) query result
        for dist, idx in zip(distances[0], indices[0]):
            # FAISS returns -1 for empty/invalid slots
            if idx == -1:
                continue
                
            # Convert L2 distance to a similarity score between 0 and 1 (approximate)
            # A common approach is 1 / (1 + distance)
            score = 1.0 / (1.0 + float(dist))
            
            # Find the corresponding metadata
            # Assuming FAISS IDs map exactly to indices in metadata_list
            if 0 <= idx < len(metadata_list):
                metadata = metadata_list[idx]
                result_chunk = {
                    "score": round(score, 4),
                    "chunk_id": metadata.get("chunk_id"),
                    "repository_name": metadata.get("repository_name"),
                    "file_name": metadata.get("file_name"),
                    "path": metadata.get("path"),
                    "language": metadata.get("language"),
                    "content": metadata.get("content")
                }
                results.append(result_chunk)
            else:
                logger.warning(f"FAISS index returned out-of-bounds idx: {idx}")

        # Sort results by score descending (higher is better)
        results.sort(key=lambda x: x["score"], reverse=True)

        return {
            "query": query,
            "results": results
        }
