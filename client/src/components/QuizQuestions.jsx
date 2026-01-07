import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizQuestions({ questions }) {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optIndex) => {
    setAnswers({ ...answers, [currentIndex]: optIndex });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return score;
  };

  // ---------------- REVIEW MODE ----------------
  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Quiz Result</h2>

        <p className="font-semibold mb-6">
          Score: {calculateScore()} / {questions.length}
        </p>

        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correct;

          return (
            <div key={i} className="mb-6 border-b pb-4">
              <p className="font-medium mb-2">
                {i + 1}. {q.question}
              </p>

              {q.options.map((opt, idx) => (
                <p
                  key={idx}
                  className={
                    idx === q.correct
                      ? "text-green-600 font-semibold"
                      : idx === userAnswer && !isCorrect
                      ? "text-red-600"
                      : ""
                  }
                >
                  {opt}
                </p>
              ))}

              <p className="mt-2 text-sm">
                Your Answer:{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {userAnswer !== undefined
                    ? q.options[userAnswer]
                    : "Not Answered"}
                </span>
              </p>
            </div>
          );
        })}

        {/* Only Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/quiz")}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Back to Quiz
          </button>
        </div>
      </div>
    );
  }

  // ---------------- QUESTION MODE ----------------
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <p className="text-sm text-gray-500 mb-2">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <p className="font-medium mb-4">
        {currentQuestion.question}
      </p>

      {currentQuestion.options.map((opt, idx) => (
        <label key={idx} className="block mb-2">
          <input
            type="radio"
            checked={answers[currentIndex] === idx}
            onChange={() => handleSelect(idx)}
            className="mr-2"
          />
          {opt}
        </label>
      ))}

      <div className="flex justify-end mt-6">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentIndex] === undefined}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answers[currentIndex] === undefined}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
