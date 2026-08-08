import logging
import re
import uuid
from typing import Dict, List, Optional

from app.core.config import settings
from app.services.indexing.vector_store_service import VectorStoreService
from app.services.llm.llm_service import LLMService
from app.services.llm.prompt_service import PromptService
from app.services.retrieval.retrieval_service import RetrievalService

logger = logging.getLogger(__name__)


class ProjectInterviewError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ProjectInterviewService:
    """
    Orchestrates repository-aware technical interviews.
    Generates questions from the indexed repository context and evaluates answers.
    """

    _REPOSITORY_NAME_PATTERN = re.compile(r"^[A-Za-z0-9._-]{1,120}$")
    _VALID_DIFFICULTIES = {"easy", "medium", "hard"}

    # Class-level session storage (shared across all instances)
    _sessions: Dict[str, Dict] = {}

    def __init__(
        self,
        retrieval_service: Optional[RetrievalService] = None,
        prompt_service: Optional[PromptService] = None,
        llm_service: Optional[LLMService] = None,
        vector_store_service: Optional[VectorStoreService] = None,
    ):
        self.retrieval_service = retrieval_service or RetrievalService()
        self.prompt_service = prompt_service or PromptService()
        self.llm_service = llm_service or LLMService()
        self.vector_store_service = vector_store_service or VectorStoreService()

    def start_interview(
        self, repository_name: str, difficulty: str = "medium"
    ) -> Dict:
        """
        Start a new interview session and generate the first question.
        """
        repository_name = (repository_name or "").strip()
        difficulty = (difficulty or "medium").lower().strip()

        self._validate_repository_name(repository_name)
        self._validate_difficulty(difficulty)

        if not self.vector_store_service.has_index(repository_name):
            raise ProjectInterviewError(
                f"Repository '{repository_name}' is not indexed or index files are missing.",
                status_code=404,
            )

        session_id = str(uuid.uuid4())

        # Generate first question based on repository context and difficulty
        first_question = self._generate_initial_question(repository_name, difficulty)

        # Determine minimum questions based on difficulty
        min_questions_map = {"easy": 3, "medium": 5, "hard": 7}
        min_questions = min_questions_map.get(difficulty, 5)

        session = {
            "session_id": session_id,
            "repository_name": repository_name,
            "difficulty": difficulty,
            "questions": [first_question],
            "answers": [],
            "current_question_index": 0,
            "total_score": 0,
            "min_questions": min_questions,
            "questions_answered": 0,
        }

        ProjectInterviewService._sessions[session_id] = session

        return {
            "session_id": session_id,
            "question": first_question,
            "difficulty": difficulty,
        }

    def submit_answer(self, session_id: str, answer: str) -> Dict:
        """
        Evaluate candidate's answer and generate feedback with next question.
        """
        session_id = (session_id or "").strip()
        answer = (answer or "").strip()

        self._validate_session_id(session_id)
        self._validate_answer(answer)

        session = ProjectInterviewService._sessions[session_id]
        repository_name = session["repository_name"]
        difficulty = session["difficulty"]
        current_question_index = session["current_question_index"]
        current_question = session["questions"][current_question_index]

        # Retrieve repository context for evaluation
        retrieval_result = self.retrieval_service.search(
            repository_name=repository_name,
            query=current_question,
            top_k=5,
        )

        chunks = retrieval_result.get("results", [])

        # Evaluate the answer
        evaluation = self._evaluate_answer(
            repository_name=repository_name,
            question=current_question,
            answer=answer,
            retrieved_chunks=chunks,
        )

        score = evaluation["score"]
        feedback = evaluation["feedback"]
        strengths = evaluation["strengths"]
        improvements = evaluation["improvements"]

        session["total_score"] += score
        session["answers"].append(
            {
                "question": current_question,
                "answer": answer,
                "score": score,
                "feedback": feedback,
            }
        )
        session["questions_answered"] = session.get("questions_answered", 0) + 1
        session["current_question_index"] += 1

        questions_answered = session["questions_answered"]
        min_questions = session.get("min_questions", 5)

        # Generate follow-up or next question
        # Only allow interview to end (next_question=None) once min_questions have been answered
        next_question = self._generate_follow_up(
            repository_name=repository_name,
            question=current_question,
            answer=answer,
            retrieved_chunks=chunks,
            difficulty=difficulty,
            questions_answered=questions_answered,
            min_questions=min_questions,
        )

        if next_question:
            session["questions"].append(next_question)

        response = {
            "session_id": session_id,
            "score": score,
            "feedback": feedback,
            "strengths": strengths,
            "improvements": improvements,
            "next_question": next_question,
            "difficulty": difficulty,
        }

        return response

    def end_interview(self, session_id: str) -> Dict:
        """
        End an interview session and provide final summary.
        """
        import traceback
        
        logger.info(f"end_interview called with session_id: {session_id}")
        
        session_id = (session_id or "").strip()

        self._validate_session_id(session_id)
        logger.info(f"Session validated successfully")

        session = ProjectInterviewService._sessions[session_id]
        logger.info(f"Session loaded: {session.get('repository_name')}")
        
        total_questions = len(session["questions"])
        total_score = session["total_score"]
        logger.info(f"Total questions: {total_questions}, Total score: {total_score}")
        
        # Calculate average score
        if total_questions > 0:
            average_score = round(total_score / total_questions, 1)
        else:
            average_score = 0.0
        logger.info(f"Average score: {average_score}")

        # Generate final feedback
        try:
            final_feedback = self._generate_final_feedback(
                session=session,
                average_score=average_score,
            )
            logger.info(f"Final feedback generated: {final_feedback[:100]}...")
        except Exception as e:
            logger.error(f"Error generating final feedback: {e}")
            traceback.print_exc()
            final_feedback = f"Interview completed with {total_questions} questions and average score of {average_score}/10."

        # Clean up session AFTER generating the response
        del ProjectInterviewService._sessions[session_id]
        logger.info("Session deleted from storage")

        result = {
            "session_id": session_id,
            "total_score": int(total_score),
            "average_score": average_score,
            "final_feedback": final_feedback,
            "total_questions": total_questions,
        }
        logger.info(f"End interview result: {result}")

        return result

    def get_session(self, session_id: str) -> Dict:
        """
        Get interview session details.
        """
        session_id = (session_id or "").strip()

        self._validate_session_id(session_id)

        session = ProjectInterviewService._sessions[session_id]

        return {
            "session_id": session["session_id"],
            "repository_name": session["repository_name"],
            "difficulty": session["difficulty"],
            "current_question_index": session["current_question_index"],
            "total_score": session["total_score"],
            "questions_count": len(session["questions"]),
        }

    def _validate_repository_name(self, repository_name: str) -> None:
        if not repository_name:
            raise ProjectInterviewError("repository_name is required.", status_code=422)

        if not self._REPOSITORY_NAME_PATTERN.fullmatch(repository_name):
            raise ProjectInterviewError(
                "Invalid repository_name. Use only letters, numbers, dot, underscore, or hyphen.",
                status_code=422,
            )

    def _validate_difficulty(self, difficulty: str) -> None:
        if difficulty not in self._VALID_DIFFICULTIES:
            raise ProjectInterviewError(
                f"Invalid difficulty level. Must be one of: {', '.join(self._VALID_DIFFICULTIES)}.",
                status_code=422,
            )

    def _validate_session_id(self, session_id: str) -> None:
        if not session_id:
            raise ProjectInterviewError("session_id is required.", status_code=422)

        if session_id not in ProjectInterviewService._sessions:
            raise ProjectInterviewError(
                f"Interview session '{session_id}' not found.",
                status_code=404,
            )

    def _validate_answer(self, answer: str) -> None:
        if not answer:
            raise ProjectInterviewError("answer is required.", status_code=422)

        if len(answer.strip()) < 10:
            raise ProjectInterviewError(
                "Answer is too short. Please provide a more detailed response.",
                status_code=422,
            )

    def _generate_initial_question(self, repository_name: str, difficulty: str) -> str:
        """
        Generate the first interview question based on repository context.
        """
        # Retrieve general repository context for question generation
        retrieval_result = self.retrieval_service.search(
            repository_name=repository_name,
            query="project architecture main files and entry points",
            top_k=5,
        )

        chunks = retrieval_result.get("results", [])

        prompt = self._build_question_generation_prompt(
            repository_name=repository_name,
            difficulty=difficulty,
            retrieved_chunks=chunks,
            is_initial=True,
        )

        try:
            question = self.llm_service.generate_response(prompt=prompt)
        except Exception as e:
            logger.error(f"Failed to generate initial question for {repository_name}: {e}")
            # Fallback to a generic question based on difficulty
            return self._get_fallback_initial_question(difficulty)

        # Clean up the question
        question = self._clean_question(question)

        return question

    def _generate_follow_up(
        self,
        repository_name: str,
        question: str,
        answer: str,
        retrieved_chunks: List[Dict],
        difficulty: str,
        questions_answered: int = 1,
        min_questions: int = 5,
    ) -> Optional[str]:
        """
        Generate a follow-up question based on the candidate's answer.
        Only returns None (interview ends) if min_questions have been answered
        AND the LLM signals no follow-up is needed.
        """
        must_continue = questions_answered < min_questions

        prompt = self._build_follow_up_prompt(
            repository_name=repository_name,
            previous_question=question,
            candidate_answer=answer,
            retrieved_chunks=retrieved_chunks,
            difficulty=difficulty,
            must_continue=must_continue,
        )

        try:
            follow_up = self.llm_service.generate_response(prompt=prompt)
        except Exception as e:
            logger.error(f"Failed to generate follow-up question: {e}")
            if must_continue:
                # LLM failed but we haven't reached min_questions — use a fallback
                return self._get_fallback_follow_up_question(repository_name, difficulty)
            return None

        follow_up = self._clean_question(follow_up)

        # Check if LLM signalled no follow-up
        no_followup_signals = (
            not follow_up
            or follow_up.lower().startswith("no follow-up")
            or follow_up.lower().startswith("no more question")
            or follow_up.lower() == "none"
        )

        if no_followup_signals:
            if must_continue:
                # We haven't hit min_questions yet — use a fallback
                logger.warning(
                    f"LLM returned no follow-up after {questions_answered}/{min_questions} questions. "
                    "Using fallback question to meet minimum."
                )
                return self._get_fallback_follow_up_question(repository_name, difficulty)
            # min_questions reached — it's okay to end
            return None

        return follow_up

    def _evaluate_answer(
        self,
        repository_name: str,
        question: str,
        answer: str,
        retrieved_chunks: List[Dict],
    ) -> Dict:
        """
        Evaluate candidate's answer using repository context.
        """
        prompt = self._build_evaluation_prompt(
            repository_name=repository_name,
            question=question,
            candidate_answer=answer,
            retrieved_chunks=retrieved_chunks,
        )

        try:
            evaluation = self.llm_service.generate_response(prompt=prompt)
        except Exception as e:
            logger.error(f"Failed to evaluate answer: {e}")
            # Return default evaluation
            return {
                "score": 5,
                "feedback": "Could not generate evaluation due to LLM error.",
                "strengths": [],
                "improvements": [],
            }

        return self._parse_evaluation(evaluation)

    def _generate_final_feedback(self, session: Dict, average_score: float) -> str:
        """
        Generate final interview feedback.
        """
        prompt = self._build_final_feedback_prompt(
            session=session,
            average_score=average_score,
        )

        try:
            feedback = self.llm_service.generate_response(prompt=prompt)
        except Exception as e:
            logger.error(f"Failed to generate final feedback: {e}")
            return f"Interview completed with average score of {average_score}/10. Review your answers to improve your understanding of the repository."

        return feedback

    def _build_question_generation_prompt(
        self, repository_name: str, difficulty: str, retrieved_chunks: List[Dict], is_initial: bool = False
    ) -> str:
        """
        Build prompt for generating interview questions from repository context.
        """
        context_blocks = []
        consumed_chars = 0

        for idx, chunk in enumerate(retrieved_chunks, start=1):
            file_name = chunk.get("file_name", "Unknown")
            path = chunk.get("path", "Unknown")
            content = (chunk.get("content") or "").strip()

            if not content:
                continue

            # Truncate if needed
            if len(content) > settings.CHAT_MAX_CHUNK_CHARS:
                content = content[: settings.CHAT_MAX_CHUNK_CHARS].rstrip() + "\n... [truncated]"

            block = f"[Chunk {idx}]\nFile: {file_name}\nPath: {path}\nCode:\n{content}\n"

            if consumed_chars + len(block) > settings.CHAT_MAX_CONTEXT_CHARS:
                break

            context_blocks.append(block)
            consumed_chars += len(block)

        context_text = (
            "\n".join(context_blocks)
            if context_blocks
            else "No repository context was retrieved."
        )

        if is_initial:
            difficulty_instructions = {
                "easy": "Ask basic questions about the project architecture, main files, and general purpose.",
                "medium": "Ask questions about specific components, service interactions, and design decisions.",
                "hard": "Ask questions about trade-offs, scalability, error handling, and complex implementation details.",
            }

            return (
                f"You are conducting a technical interview for a candidate who has worked on the '{repository_name}' project.\n"
                f"Difficulty: {difficulty}\n\n"
                "The candidate is familiar with this codebase and will be asked questions about their implementation choices.\n\n"
                f"{difficulty_instructions[difficulty]}\n\n"
                "Requirements for the question:\n"
                "- Must be directly related to the repository code and implementation\n"
                "- Should focus on design decisions, architecture, or specific implementation details\n"
                "- Should not ask generic DSA or programming questions\n"
                "- Keep the question concise and clear\n"
                "- Do not include any additional text or formatting\n\n"
                "Repository Context:\n"
                f"{context_text}\n\n"
                "Return ONLY the interview question without any prefix like 'Question:' or 'Interview Question:'."
            )

        return (
            f"You are conducting a technical interview for the '{repository_name}' project.\n"
            f"Difficulty: {difficulty}\n\n"
            "The candidate has previously answered a question and you need to ask a follow-up.\n\n"
            "Requirements for the follow-up question:\n"
            "- Based on the previous answer, dig deeper into their knowledge\n"
            "- Ask about specific implementation details or trade-offs\n"
            "- Challenge their decisions to assess true understanding\n"
            "- Keep the question concise and clear\n"
            "- Do not ask for repetition\n"
            "- Do not include any additional text or formatting\n\n"
            "Previous Question:\n"
            f"{question}\n\n"
            "Candidate's Answer:\n"
            f"{answer}\n\n"
            "Repository Context:\n"
            f"{context_text}\n\n"
            "Return ONLY the follow-up question without any prefix."
        )

    def _build_follow_up_prompt(
        self,
        repository_name: str,
        previous_question: str,
        candidate_answer: str,
        retrieved_chunks: List[Dict],
        difficulty: str,
        must_continue: bool = True,
    ) -> str:
        """
        Build prompt for generating follow-up questions.
        """
        context_blocks = []
        consumed_chars = 0

        for idx, chunk in enumerate(retrieved_chunks, start=1):
            file_name = chunk.get("file_name", "Unknown")
            path = chunk.get("path", "Unknown")
            content = (chunk.get("content") or "").strip()

            if not content:
                continue

            if len(content) > settings.CHAT_MAX_CHUNK_CHARS:
                content = content[: settings.CHAT_MAX_CHUNK_CHARS].rstrip() + "\n... [truncated]"

            block = f"[Chunk {idx}]\nFile: {file_name}\nPath: {path}\nCode:\n{content}\n"

            if consumed_chars + len(block) > settings.CHAT_MAX_CONTEXT_CHARS:
                break

            context_blocks.append(block)
            consumed_chars += len(block)

        context_text = (
            "\n".join(context_blocks)
            if context_blocks
            else "No repository context was retrieved."
        )

        difficulty_guidelines = {
            "easy": "Ask basic clarifying questions or request simple explanations.",
            "medium": "Ask about design rationale, component interactions, or implementation choices.",
            "hard": "Ask about trade-offs, edge cases, scalability concerns, or alternative approaches.",
        }

        # Mandatory instruction to always produce a question
        must_continue_instruction = (
            "IMPORTANT: You MUST generate a follow-up question. "
            "The interview has not yet reached the minimum number of questions. "
            "Do NOT say 'No follow-up' or refuse. Always output a question.\n\n"
            if must_continue
            else ""
        )

        return (
            f"You are conducting a technical interview for the '{repository_name}' project.\n"
            f"Difficulty Level: {difficulty}\n\n"
            f"{must_continue_instruction}"
            "Candidate's Previous Answer:\n"
            f"{candidate_answer}\n\n"
            "Previous Question:\n"
            f"{previous_question}\n\n"
            f"{difficulty_guidelines[difficulty]}\n\n"
            "Analyze the answer and identify areas to probe deeper:\n"
            "1. If the candidate mentioned a specific technology or framework, ask why they chose it\n"
            "2. If they described an implementation, ask about alternative approaches\n"
            "3. If they explained a design decision, ask about trade-offs\n"
            "4. If they referenced a file or class, ask about its responsibilities\n\n"
            "Requirements:\n"
            "- Make the question specific to the repository implementation\n"
            "- Challenge the candidate's understanding\n"
            "- Keep it concise (one sentence)\n"
            "- Do not repeat the previous question\n\n"
            "Repository Context:\n"
            f"{context_text}\n\n"
            "Return ONLY the follow-up question. Do NOT include any preamble, explanation, or refusal."
        )

    def _build_evaluation_prompt(
        self, repository_name: str, question: str, candidate_answer: str, retrieved_chunks: List[Dict]
    ) -> str:
        """
        Build prompt for evaluating candidate's answer against repository context.
        """
        context_blocks = []
        consumed_chars = 0

        for idx, chunk in enumerate(retrieved_chunks, start=1):
            file_name = chunk.get("file_name", "Unknown")
            path = chunk.get("path", "Unknown")
            content = (chunk.get("content") or "").strip()

            if not content:
                continue

            if len(content) > settings.CHAT_MAX_CHUNK_CHARS:
                content = content[: settings.CHAT_MAX_CHUNK_CHARS].rstrip() + "\n... [truncated]"

            block = f"[Chunk {idx}]\nFile: {file_name}\nPath: {path}\nCode:\n{content}\n"

            if consumed_chars + len(block) > settings.CHAT_MAX_CONTEXT_CHARS:
                break

            context_blocks.append(block)
            consumed_chars += len(block)

        context_text = (
            "\n".join(context_blocks)
            if context_blocks
            else "No repository context was retrieved."
        )

        return (
            f"You are evaluating a candidate's answer for the '{repository_name}' project interview.\n\n"
            "Question:\n"
            f"{question}\n\n"
            "Candidate's Answer:\n"
            f"{candidate_answer}\n\n"
            "Repository Context (Actual Implementation):\n"
            f"{context_text}\n\n"
            "Evaluate the answer based on:\n"
            "1. Correctness - How accurate is the information?\n"
            "2. Understanding - Does the candidate demonstrate knowledge of the implementation?\n"
            "3. Completeness - Did they cover the key aspects of the implementation?\n"
            "4. Alignment with codebase - Did they correctly describe the actual implementation?\n\n"
            "Provide a score from 1 to 10, where:\n"
            "- 1-3: Incorrect or shows fundamental misunderstanding\n"
            "- 4-6: Partial understanding but missing key points\n"
            "- 7-8: Good understanding with minor inaccuracies\n"
            "- 9-10: Excellent answer that accurately reflects the implementation\n\n"
            "Return your response in the following JSON format (no other text):\n"
            "{\n"
            '  "score": <1-10>,\n'
            '  "feedback": "<concise overall feedback>",\n'
            '  "strengths": ["<strength1>", "<strength2>", ...],\n'
            '  "improvements": ["<area1>", "<area2>", ...]\n'
            "}\n\n"
            "Ensure the JSON is valid and parseable."
        )

    def _build_final_feedback_prompt(self, session: Dict, average_score: float) -> str:
        """
        Build prompt for generating final interview feedback.
        """
        questions_text = "\n".join(
            f"Q{i+1}: {q}" for i, q in enumerate(session["questions"])
        )

        answers_text = "\n".join(
            f"A{i+1} (Score: {a['score']}/10): {a['answer']}" for i, a in enumerate(session["answers"])
        )

        return (
            f"You conducted a technical interview for the '{session['repository_name']}' project.\n"
            f"Difficulty: {session['difficulty']}\n"
            f"Total Questions: {len(session['questions'])}\n"
            f"Total Score: {session['total_score']}/{len(session['questions']) * 10}\n"
            f"Average Score: {average_score}/10\n\n"
            "Interview Questions:\n"
            f"{questions_text}\n\n"
            "Candidate Answers:\n"
            f"{answers_text}\n\n"
            "Provide a comprehensive final feedback summary that:\n"
            "1. Overall performance assessment\n"
            "2. Key strengths demonstrated\n"
            "3. Areas for improvement\n"
            "4. Specific recommendations for the candidate\n\n"
            "Format the feedback in a professional, constructive tone.\n"
            "Keep it concise but informative (3-5 paragraphs)."
        )

    def _parse_evaluation(self, evaluation_text: str) -> Dict:
        """
        Parse the LLM evaluation response into structured data.
        """
        import json

        try:
            # Try to parse as JSON
            start = evaluation_text.find("{")
            end = evaluation_text.rfind("}") + 1

            if start != -1 and end > start:
                json_str = evaluation_text[start:end]
                evaluation = json.loads(json_str)
                return {
                    "score": int(evaluation.get("score", 5)),
                    "feedback": evaluation.get("feedback", "No feedback provided."),
                    "strengths": evaluation.get("strengths", []),
                    "improvements": evaluation.get("improvements", []),
                }
        except (json.JSONDecodeError, ValueError, TypeError) as e:
            logger.error(f"Failed to parse evaluation JSON: {e}")

        # Fallback parsing if JSON parsing fails
        score = 5
        feedback = evaluation_text
        strengths = []
        improvements = []

        # Try to extract score from text
        import re

        score_match = re.search(r'"score":\s*(\d+)', evaluation_text)
        if score_match:
            score = int(score_match.group(1))

        return {
            "score": score,
            "feedback": feedback,
            "strengths": strengths,
            "improvements": improvements,
        }

    def _clean_question(self, question: str) -> str:
        """
        Clean up the generated question to remove prefixes and extra text.
        """
        question = question.strip()

        # Remove common prefixes
        prefixes = [
            "Question:",
            "Interview Question:",
            "Q:",
            "Question:",
            "Interviewer:",
        ]

        for prefix in prefixes:
            if question.startswith(prefix):
                question = question[len(prefix) :].strip()

        # Remove leading quotes
        question = question.strip('"').strip("'")

        # Remove trailing punctuation that shouldn't be there
        question = question.rstrip(".").strip()

        return question

    def _get_fallback_initial_question(self, difficulty: str) -> str:
        """
        Return a fallback question if LLM fails to generate the initial question.
        """
        fallback_questions = {
            "easy": "Can you explain the overall architecture of this project and describe the main entry points?",
            "medium": "Can you explain how the repository indexing pipeline works and what happens during each step?",
            "hard": "Can you explain the trade-offs made in the current implementation and suggest improvements for scalability?",
        }

        return fallback_questions.get(difficulty, fallback_questions["medium"])

    def _get_fallback_follow_up_question(self, repository_name: str, difficulty: str) -> str:
        """
        Return a fallback follow-up question when the LLM declines to generate one
        but the minimum question count has not yet been reached.
        """
        import random

        fallback_pool = {
            "easy": [
                f"Can you describe how error handling is implemented in the {repository_name} project?",
                f"What external dependencies does {repository_name} use, and what role do they play?",
                f"How are environment variables or configuration values managed in {repository_name}?",
                f"Can you walk through the main file structure of {repository_name} and explain each directory?",
            ],
            "medium": [
                f"How does authentication or authorization work in the {repository_name} project?",
                f"What data storage strategy does {repository_name} use, and why was it chosen?",
                f"How are API routes organized in {repository_name}? What conventions are followed?",
                f"How does {repository_name} handle asynchronous operations or background tasks?",
                f"What testing strategies or tools are used in {repository_name}?",
            ],
            "hard": [
                f"What are the main performance bottlenecks you see in {repository_name}, and how would you address them?",
                f"How would you scale the current {repository_name} architecture to handle 10x traffic?",
                f"What security vulnerabilities might exist in {repository_name}'s current implementation?",
                f"If you were to refactor {repository_name}, what architectural changes would you make and why?",
                f"How does {repository_name} handle fault tolerance and recovery from failures?",
            ],
        }

        pool = fallback_pool.get(difficulty, fallback_pool["medium"])
        return random.choice(pool)
