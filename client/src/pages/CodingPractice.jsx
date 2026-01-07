import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CodingPractice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { problems, topicPart } = state || {};
  const [index, setIndex] = useState(0);

  // 🔐 Route protection
  if (!problems || problems.length === 0) {
    navigate("/coding");
    return null;
  }

  // 🎉 Completion screen
  if (index >= problems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Well Done 🎉</h2>
          <p className="text-gray-500 mb-6">
            You’ve completed all problems for this topic.
          </p>
          <button
            onClick={() => navigate("/coding")}
            className="w-full bg-black text-white py-3 rounded-lg font-bold"
          >
            PRACTICE AGAIN
          </button>
        </div>
      </div>
    );
  }

  const current = problems[index];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-6 text-sm text-gray-500 text-center">
          Topic Group: <span className="font-bold">{topicPart}</span>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <span className="text-xs text-gray-400 uppercase font-bold">
            Problem {index + 1} of {problems.length}
          </span>

          <h2 className="text-2xl font-bold mt-4 mb-3">
            {current.title}
          </h2>

          <span className="inline-block mb-6 px-4 py-1 rounded-full text-sm font-bold bg-gray-200">
            {current.difficulty}
          </span>

          {/* Practice Links */}
          <div className="flex flex-col gap-4 mb-8">
            <a
              href={current.leetcodeLink || "https://leetcode.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border-2 border-black py-3 rounded-xl font-bold hover:bg-black hover:text-white transition"
            >
              Practice on LeetCode/GFG
            </a>

           
          </div>

          <button
            onClick={() => setIndex((prev) => prev + 1)}
            className="w-full bg-black text-white py-3 rounded-xl font-bold"
          >
            NEXT PROBLEM
          </button>

        </div>
      </div>
    </div>
  );
}
