import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import all parts
import { STRIVER_A2Z_PART_1 } from "../constants/striverA2Z";
import { STRIVER_A2Z_PART_2 } from "../constants/striverA2Z";
import { STRIVER_A2Z_PART_3 } from "../constants/striverA2Z";
import { STRIVER_A2Z_PART_4 } from "../constants/striverA2Z";
import { STRIVER_A2Z_PART_5 } from "../constants/striverA2Z";
import { getRandomA2ZQuestions } from "../utils/getRandomQuestions";

export default function Coding() {
  const [part, setPart] = useState("");
  const navigate = useNavigate();

  // MERGE ALL PARTS INTO ONE OBJECT
  const STRIVER_A2Z = {
    ...STRIVER_A2Z_PART_1,
    ...STRIVER_A2Z_PART_2,
    ...STRIVER_A2Z_PART_3,
    ...STRIVER_A2Z_PART_4,
    ...STRIVER_A2Z_PART_5,
  };

  const startCoding = () => {
    // Now STRIVER_A2Z contains "Part 1", "Part 2", etc.
    const questions = STRIVER_A2Z[part];

    if (!questions || questions.length === 0) {
      alert("No questions available for this part");
      return;
    }

    const selectedProblems = getRandomA2ZQuestions(questions);

    navigate("/coding-practice", {
      state: {
        problems: selectedProblems,
        topicPart: part,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Coding Practice (Striver A2Z)
        </h2>

        <label className="block text-sm font-medium mb-2">
          Select Topic Part
        </label>

        <select
          className="w-full p-3 border rounded-lg mb-6"
          value={part} // Added value for controlled component
          onChange={(e) => setPart(e.target.value)}
        >
          <option value="">Select Topic</option>
          <option value="Part 1">Part 1: Arrays + Binary Search + Greedy</option>
          <option value="Part 2">Part 2: Strings + Sliding Window + LL + Stack + Queue</option>
          <option value="Part 3">Part 3: Tree</option>
          <option value="Part 4">Part 4: Graph</option>
          <option value="Part 5">Part 5: DP + Recursion + Backtracking</option>
        </select>

        <button
          disabled={!part}
          onClick={startCoding}
          className="w-full bg-black text-white py-4 rounded-xl font-bold disabled:bg-gray-300 transition-colors"
        >
          START CODING
        </button>
      </div>
    </div>
  );
}