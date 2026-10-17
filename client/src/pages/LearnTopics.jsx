import { useState } from "react";
import { generateTopicExplanation } from "../services/api";
import AIError from "../components/AiError";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_LEARN_CONTENT } from "../constants/defaultLearnContent";
import {
  getTopicValidationError,
  getTopicWordCount,
  MAX_TOPIC_WORDS,
  MAX_TOPIC_LENGTH,
  normalizeTopic,
} from "../utils/topicValidation";

const TOPICS = [
  "OOPs",
  "Operating System",
  "DBMS",
  "Computer Networks",
  "Data Structures & Algorithms",
  "React",
  "JavaScript",
];
const CUSTOM_TOPIC = "__custom__";

const GFG_LINKS = {
  OOPs: "https://www.geeksforgeeks.org/oops-interview-questions/",
  "Operating System":
    "https://www.geeksforgeeks.org/operating-systems-interview-questions/",
  DBMS: "https://www.geeksforgeeks.org/dbms-interview-questions/",
  "Computer Networks":
    "https://www.geeksforgeeks.org/computer-networks-interview-questions/",
  "Data Structures & Algorithms":
    "https://www.geeksforgeeks.org/data-structures-interview-questions/",
  React: "https://www.geeksforgeeks.org/react-interview-questions/",
  JavaScript:
    "https://www.geeksforgeeks.org/javascript-interview-questions/",
};

export default function LearnTopics() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRequested, setHasRequested] = useState(false);
  const [isFallback, setIsFallback] = useState(false); // ✅ NEW
  const [customTopic, setCustomTopic] = useState("");
  const [topicError, setTopicError] = useState("");
  const effectiveTopic =
    selectedTopic === CUSTOM_TOPIC ? normalizeTopic(customTopic) : selectedTopic;
  const customTopicError =
    selectedTopic === CUSTOM_TOPIC ? getTopicValidationError(customTopic) : "";

  const handleGenerate = async () => {
    const validationError = selectedTopic === CUSTOM_TOPIC ? customTopicError : "";
    if (!effectiveTopic || validationError) {
      setTopicError(validationError || "Please select or enter a topic.");
      return;
    }

    setLoading(true);
    setExplanation("");
    setError("");
    setHasRequested(true);
    setIsFallback(false);

    try {
      const data = await generateTopicExplanation(effectiveTopic);
      setExplanation(data);
    } catch (err) {
      setError(handleAIError(err));
      setExplanation(DEFAULT_LEARN_CONTENT[effectiveTopic]); // ✅ fallback
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        📘 Learn Topics
      </h1>

      {/* Topic Selector */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mb-6">
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setTopicError("");
          }}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">-- Select Topic --</option>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
          <option value={CUSTOM_TOPIC}>Custom Topic</option>
        </select>
        {selectedTopic === CUSTOM_TOPIC && (
          <div className="mb-4">
            <input
              value={customTopic}
              maxLength={MAX_TOPIC_LENGTH}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setTopicError("");
              }}
              placeholder="e.g., SQL Window Functions, React Hooks"
              className="w-full border px-4 py-2 rounded"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{getTopicWordCount(customTopic)}/{MAX_TOPIC_WORDS} words</span>
              <span>{customTopic.length}/{MAX_TOPIC_LENGTH}</span>
            </div>
          </div>
        )}
        {topicError && <p className="text-red-600 text-sm mb-4">{topicError}</p>}

        <button
          onClick={handleGenerate}
          disabled={!effectiveTopic || Boolean(customTopicError) || loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Get Explanation"}
        </button>
      </div>

      {/* Content after click */}
      {hasRequested && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {effectiveTopic} – Interview Notes
          </h2>

          {/* AI error message (informational) */}
          {error && <AIError message={error} />}

          {/* Fallback notice */}
          {isFallback && (
            <p className="text-sm text-orange-600 mb-4">
              ⚠ AI is temporarily unavailable. Showing standard interview questions.
            </p>
          )}

          {/* Explanation / Fallback content */}
          <pre className="text-sm text-gray-700 whitespace-pre-wrap mb-6">
            {explanation}
          </pre>

          {/* GFG link */}
          <div className="border-t pt-4 mt-4">
            <p className="font-medium mb-2">
              🔗 Practice Interview Questions:
            </p>
            <a
              href={GFG_LINKS[effectiveTopic]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              GeeksforGeeks {effectiveTopic} Interview Questions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
