import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterviewQuestions } from "../services/api";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_INTERVIEW_QUESTIONS } from "../constants/defaultInterviewQuestions";
import {
  getTopicValidationError,
  getTopicWordCount,
  MAX_TOPIC_WORDS,
  MAX_TOPIC_LENGTH,
  normalizeTopic,
} from "../utils/topicValidation";

const TOPICS = [
  "OOPS",
  "Operating System",
  "DBMS",
  "Computer Network",
  "DSA",
  "JavaScript",
  "MERN Stack",
  "HR",
  "Mock Interview",
  "Python and AI/ML",
];
const CUSTOM_TOPIC = "__custom__";

export default function Interview() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [topicError, setTopicError] = useState("");

  const navigate = useNavigate();
  const effectiveTopic = topic === CUSTOM_TOPIC ? normalizeTopic(customTopic) : topic;
  const customTopicError =
    topic === CUSTOM_TOPIC ? getTopicValidationError(customTopic) : "";

  const startInterview = async () => {
    try {
      setLoading(true);
      setInfo("");

      const questions = await generateInterviewQuestions(effectiveTopic, difficulty);

      navigate("/interview-practice", {
        state: { questions, topic },
      });
    } catch (err) {
      setInfo(handleAIError(err) + " Showing standard interview questions.");

      navigate("/interview-practice", {
        state: {
          questions: DEFAULT_INTERVIEW_QUESTIONS[effectiveTopic] || [],
          topic: effectiveTopic,
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
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setTopicError("");
          }}
        >
          <option value="">Select Topic</option>
          {TOPICS.map((item) => <option key={item}>{item}</option>)}
          <option value={CUSTOM_TOPIC}>Custom Topic</option>
        </select>
        {topic === CUSTOM_TOPIC && (
          <div className="mb-4">
            <input
              value={customTopic}
              maxLength={MAX_TOPIC_LENGTH}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setTopicError("");
              }}
              placeholder="e.g., Java Multithreading, System Design"
              className="w-full p-3 border rounded-lg"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{getTopicWordCount(customTopic)}/{MAX_TOPIC_WORDS} words</span>
              <span>{customTopic.length}/{MAX_TOPIC_LENGTH}</span>
            </div>
          </div>
        )}
        {topicError && <p className="text-red-600 text-sm mb-4">{topicError}</p>}

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
          disabled={!effectiveTopic || Boolean(customTopicError) || !difficulty || loading}
          onClick={startInterview}
          className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:bg-gray-300"
        >
          {loading ? "GENERATING QUESTIONS..." : "START INTERVIEW"}
        </button>
      </div>
    </div>
  );
}
