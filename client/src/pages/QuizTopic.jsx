import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  "Computer Networks",
  "Data Structures & Algorithms",
  "React",
  "JavaScript",
  "Java",
  "MERN Stack",
  "Python",
  "AI/ML"
];
const CUSTOM_TOPIC = "__custom__";

export default function QuizTopic() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const effectiveTopic = topic === CUSTOM_TOPIC ? normalizeTopic(customTopic) : topic;
  const validationError = topic === CUSTOM_TOPIC
    ? getTopicValidationError(customTopic)
    : "";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        📝 Quiz – Choose Topic
      </h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <select
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setError("");
          }}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">-- Select Topic --</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value={CUSTOM_TOPIC}>Custom Topic</option>
        </select>

        {topic === CUSTOM_TOPIC && (
          <div className="mb-4">
            <input
              value={customTopic}
              maxLength={MAX_TOPIC_LENGTH}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setError("");
              }}
              placeholder="e.g., Java Multithreading, React Hooks"
              className="w-full border px-4 py-2 rounded"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{getTopicWordCount(customTopic)}/{MAX_TOPIC_WORDS} words</span>
              <span>{customTopic.length}/{MAX_TOPIC_LENGTH}</span>
            </div>
          </div>
        )}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button
          onClick={() => {
            const nextError = topic === CUSTOM_TOPIC ? validationError : "";
            if (nextError) {
              setError(nextError);
              return;
            }
            navigate("/quiz-practice", { state: { topic: effectiveTopic } });
          }}
          disabled={!effectiveTopic || Boolean(validationError)}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
