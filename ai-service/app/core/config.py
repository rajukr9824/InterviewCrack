from dotenv import load_dotenv
import os
from pathlib import Path

# Anchor all paths to this file's location (app/core/config.py).
# Three .parent calls resolve:  app/core/  →  app/  →  ai-service/  (project root)
# This makes every path CWD-independent: the server behaves identically whether
# launched from ai-service/, the monorepo root, or an IDE working directory.
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_ENV_PATH = _PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=_ENV_PATH)


class Settings:
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "gemini")

    # LLM Configuration
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
    EMBEDDING_BATCH_SIZE = int(os.getenv("EMBEDDING_BATCH_SIZE", "100"))
    CHAT_MODEL = os.getenv("CHAT_MODEL", "gemini-2.5-flash")
    CHAT_TOP_K = int(os.getenv("CHAT_TOP_K", "5"))
    CHAT_MAX_CONTEXT_CHARS = int(os.getenv("CHAT_MAX_CONTEXT_CHARS", "12000"))
    CHAT_MAX_CHUNK_CHARS = int(os.getenv("CHAT_MAX_CHUNK_CHARS", "1400"))

    # Repository Configuration
    PROJECT_ROOT: Path = _PROJECT_ROOT
    REPOSITORY_STORAGE_PATH: str = str(_PROJECT_ROOT / "repositories")
    VECTOR_STORE_PATH: str = str(_PROJECT_ROOT / "vector_store")

    SUPPORTED_EXTENSIONS = {
        ".py",
        ".js",
        ".ts",
        ".tsx",
        ".jsx",
        ".java",
        ".json",
        ".yaml",
        ".yml",
        ".md",
        ".html",
        ".css",
    }

    IGNORED_DIRECTORIES = {
        ".git",
        "node_modules",
        "venv",
        ".venv",
        "dist",
        "build",
        "coverage",
        "__pycache__",
    }


settings = Settings()
