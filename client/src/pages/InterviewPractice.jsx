import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function InterviewPractice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { questions, topic } = state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // 🔐 Route protection
  if (!questions || questions.length === 0) {
    navigate("/interview");
    return null;
  }

  // 🎉 COMPLETION SCREEN
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
            onClick={() => navigate("/interview")}
            className="w-full bg-black text-white py-3 rounded-lg font-bold"
          >
            PRACTICE AGAIN
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">

        {/* Progress */}
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
