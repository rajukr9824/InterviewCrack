import { useState } from "react";
import { generateTopicExplanation } from "../services/api";
import AIError from "../components/AiError";
import { handleAIError } from "../utils/aiError";
import { DEFAULT_LEARN_CONTENT } from "../constants/defaultLearnContent";

const TOPICS = [
  "OOPs",
  "Operating System",
  "DBMS",
  "Computer Networks",
  "Data Structures & Algorithms",
  "React",
  "JavaScript",
];

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

  const handleGenerate = async () => {
    if (!selectedTopic) return;

    setLoading(true);
    setExplanation("");
    setError("");
    setHasRequested(true);
    setIsFallback(false);

    try {
      const data = await generateTopicExplanation(selectedTopic);
      setExplanation(data);
    } catch (err) {
      setError(handleAIError(err));
      setExplanation(DEFAULT_LEARN_CONTENT[selectedTopic]); // ✅ fallback
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
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">-- Select Topic --</option>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={!selectedTopic || loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Get Explanation"}
        </button>
      </div>

      {/* Content after click */}
      {hasRequested && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTopic} – Interview Notes
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
              href={GFG_LINKS[selectedTopic]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              GeeksforGeeks {selectedTopic} Interview Questions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
