import logging

from fastapi import FastAPI

from app.api import chat, interview, repository

# Configure logging to show INFO level messages
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(title="InterviewCrack AI Service")

app.include_router(repository.router)
app.include_router(chat.router)
app.include_router(interview.router)
