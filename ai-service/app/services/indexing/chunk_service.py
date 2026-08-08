from typing import Dict, List


class ChunkService:
    """
    Service responsible for splitting parsed file contents into semantic chunks
    suitable for vector embeddings and retrieval.
    """

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def create_chunks(self, parsed_files: List[Dict]) -> List[Dict]:
        """
        Split parsed source files into chunks while preserving metadata.

        Args:
            parsed_files: List of dictionaries containing file metadata and content.

        Returns:
            A list of chunk dictionaries with sequential chunk IDs and metadata.
        """
        all_chunks = []
        chunk_id_counter = 1

        for file_info in parsed_files:
            content = file_info.get("content", "")
            
            if not content.strip():
                continue

            # Handle small files as a single chunk
            if len(content) <= self.chunk_size:
                all_chunks.append({
                    "chunk_id": chunk_id_counter,
                    "file_name": file_info.get("file_name"),
                    "path": file_info.get("path"),
                    "language": file_info.get("language"),
                    "content": content,
                })
                chunk_id_counter += 1
                continue

            # Split large files into chunks with overlap
            start = 0
            while start < len(content):
                end = start + self.chunk_size
                chunk_content = content[start:end]

                # Skip empty or whitespace-only chunks
                if not chunk_content.strip():
                    start += self.chunk_size - self.chunk_overlap
                    continue

                all_chunks.append({
                    "chunk_id": chunk_id_counter,
                    "file_name": file_info.get("file_name"),
                    "path": file_info.get("path"),
                    "language": file_info.get("language"),
                    "content": chunk_content,
                })
                
                chunk_id_counter += 1
                
                # Move start forward, accounting for overlap
                start += self.chunk_size - self.chunk_overlap

        return all_chunks
