from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class StartInterviewRequest(BaseModel):
    repository_name: str = Field(
        ...,
        description="Indexed repository name to conduct interview on.",
    )
    difficulty: str = Field(
        default="medium",
        description="Interview difficulty level: easy, medium, or hard.",
    )


class StartInterviewResponse(BaseModel):
    session_id: str
    question: str
    difficulty: str


class AnswerRequest(BaseModel):
    session_id: str = Field(
        ...,
        description="Interview session ID.",
    )
    answer: str = Field(
        ...,
        description="Candidate's answer to the current question.",
    )


class AnswerResponse(BaseModel):
    session_id: str
    score: int
    feedback: str
    strengths: List[str]
    improvements: List[str]
    next_question: Optional[str] = None
    difficulty: str


class EndInterviewRequest(BaseModel):
    session_id: str = Field(
        ...,
        description="Interview session ID.",
    )


class EndInterviewResponse(BaseModel):
    session_id: str
    total_score: int
    average_score: float
    final_feedback: str
    total_questions: int


class InterviewSession(BaseModel):
    session_id: str
    repository_name: str
    difficulty: str
    questions: List[Dict]
    answers: List[Dict]
    current_question_index: int
