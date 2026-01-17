import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterviewQuestions } from "../services/api";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_INTERVIEW_QUESTIONS } from "../constants/defaultInterviewQuestions";

export default function Interview() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const startInterview = async () => {
    try {
      setLoading(true);
      setInfo("");

      const questions = await generateInterviewQuestions(topic, difficulty);

      navigate("/interview-practice", {
        state: { questions, topic },
      });
    } catch (err) {
      setInfo(handleAIError(err) + " Showing standard interview questions.");

      navigate("/interview-practice", {
        state: {
          questions: DEFAULT_INTERVIEW_QUESTIONS[topic] || [],
          topic,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Setup Interview
        </h2>

        {info && (
          <div className="mb-4 text-sm text-orange-600 text-center">
            ⚠ {info}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Topic</label>
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
          <option>HR</option>
          <option>Mock Interview</option>
          <option>Python and AI/ML</option>
          
        </select>

        <label className="block text-sm font-medium mb-1">
          Difficulty
        </label>
        <select
          className="w-full p-3 border rounded-lg mb-6"
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
