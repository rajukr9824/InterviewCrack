import tempfile
import unittest
from unittest.mock import patch

from app.services.indexing.embedding_service import EmbeddingService
from app.services.indexing.vector_store_service import VectorStoreService


class UserScopedEmbeddingTests(unittest.TestCase):
    def test_embedding_client_uses_request_key(self):
        service = EmbeddingService(api_key="user-gemini-key")

        with patch("google.genai.Client") as client_factory:
            service._client = None
            client = service.client

        client_factory.assert_called_once_with(api_key="user-gemini-key")
        self.assertIs(client, client_factory.return_value)

    def test_indexes_are_isolated_and_store_compatibility_metadata(self):
        with tempfile.TemporaryDirectory() as store_path:
            service = VectorStoreService()
            service.store_path = store_path
            chunks = [{"chunk_id": "one", "content": "example", "embedding": [1.0, 2.0]}]

            self.assertTrue(
                service.build_and_save_index(
                    "repo",
                    chunks,
                    "user-a",
                    "gemini",
                    "gemini-embedding-001",
                )
            )
            self.assertTrue(service.has_index("repo", "user-a"))
            self.assertFalse(service.has_index("repo", "user-b"))

            loaded = service.load_index(
                "repo",
                "user-a",
                "gemini",
                "gemini-embedding-001",
            )
            self.assertIsNotNone(loaded)
            index, metadata = loaded
            self.assertEqual(index.d, 2)
            self.assertEqual(metadata[0]["repository_name"], "repo")


if __name__ == "__main__":
    unittest.main()
