import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TOPICS = [
  "OOPs",
  "Operating System",
  "DBMS",
  "Computer Networks",
  "Data Structures & Algorithms",
  "React",
  "JavaScript",
];

export default function QuizTopic() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        📝 Quiz – Choose Topic
      </h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        >
          <option value="">-- Select Topic --</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={() => navigate("/quiz-practice", { state: { topic } })}
          disabled={!topic}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
