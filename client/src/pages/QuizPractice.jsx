import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateQuiz } from "../services/api";
import QuizQuestions from "../components/QuizQuestions";
import AIError from "../components/AiError";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_QUIZ_QUESTIONS } from "../constants/defaultQuizQuestions";

export default function QuizPractice() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!topic) {
      navigate("/quiz");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const quiz = await generateQuiz(topic);
        setQuestions(quiz);
      } catch (err) {
        // ✅ AI failed → use fallback
        setError(handleAIError(err));
        setQuestions(DEFAULT_QUIZ_QUESTIONS[topic] || []);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, navigate]);

  if (loading) {
    return <p className="text-center mt-20">Generating quiz...</p>;
  }

  if (questions.length === 0) {
    return (
      <AIError
        message="No quiz available for this topic."
        onBack={() => navigate("/quiz")}
        backText="Back to Quiz"
      />
    );
  }

  return (
    <div className="px-4">
      {isFallback && (
        <p className="text-center text-orange-600 text-sm mb-4">
          ⚠ AI is unavailable. Showing standard practice questions.
        </p>
      )}

      <QuizQuestions questions={questions} />
    </div>
  );
}
