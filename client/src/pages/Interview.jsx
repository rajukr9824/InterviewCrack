// client/src/pages/Interview.js
import { useState } from "react";
import { generateInterviewQuestions } from "../services/api";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_INTERVIEW_QUESTIONS } from "../constants/defaultInterviewQuestions";

export default function Interview() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(""); // ℹ️ non-blocking info

  const startInterview = async () => {
    try {
      setLoading(true);
      setInfo("");

      const data = await generateInterviewQuestions(topic, difficulty);
      setQuestions(data);
      setCurrentIndex(0);
    } catch (err) {
      // ✅ FALLBACK MODE (no difficulty)
      setInfo(handleAIError(err) + " Showing standard interview questions.");
      setQuestions(DEFAULT_INTERVIEW_QUESTIONS[topic] || []);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SETUP SCREEN ----------------
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Setup Interview
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <select
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">Select Topic</option>
            <option>OOPS</option>
            <option>Operating System</option>
            <option>DBMS</option>
            <option>Computer Network</option>
            <option>DSA</option>
            <option>Javascript</option>
            <option>MERN Stack</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            className="w-full p-3 border rounded-lg mb-8"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <button
            disabled={!topic || !difficulty || loading}
            onClick={startInterview}
            className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:bg-gray-300"
          >
            {loading ? "GENERATING QUESTIONS..." : "START INTERVIEW"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------- COMPLETION SCREEN ----------------
  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Well Done!</h2>
          <p className="text-gray-500 mb-6">
            You've completed all questions.
          </p>
          <button
            onClick={() => {
              setQuestions([]);
              setInfo("");
            }}
            className="w-full bg-black text-white py-3 rounded-lg font-bold"
          >
            PRACTICE AGAIN
          </button>
        </div>
      </div>
    );
  }

  // ---------------- QUESTION SCREEN ----------------
  const current = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">

        {/* ℹ️ INFO BANNER (only when fallback used) */}
        {info && (
          <div className="mb-4 text-sm text-orange-600 text-center">
            ⚠ {info}
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>

          <h2 className="text-2xl font-semibold mt-2 mb-8">
            {current.question}
          </h2>

          {showSolution && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <h3 className="font-bold mb-2">Ideal Solution:</h3>
              <p>{current.solution}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex-1 border-2 border-black py-3 rounded-xl font-bold"
            >
              {showSolution ? "HIDE SOLUTION" : "SHOW SOLUTION"}
            </button>

            <button
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setShowSolution(false);
              }}
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold"
            >
              NEXT QUESTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
