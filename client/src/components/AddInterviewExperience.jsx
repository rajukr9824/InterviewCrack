import { useState } from "react";
import { addInterviewExperience } from "../services/interviewExperienceApi";

const AddInterviewExperience = ({ onSuccess }) => {
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    rounds: "",
    description: "",
    difficulty: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await addInterviewExperience(form);
      setForm({
        companyName: "",
        role: "",
        rounds: "",
        description: "",
        difficulty: "Medium",
      });
      onSuccess();
    } catch (err) {
      setError("Failed to submit interview experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
      <h2 className="font-semibold mb-3">
        Share Your Interview Experience
      </h2>

      {error && (
        <p className="text-red-500 mb-2">
          {error}
        </p>
      )}

      <input
        name="companyName"
        placeholder="Company Name"
        value={form.companyName}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        name="role"
        placeholder="Role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        name="rounds"
        placeholder="Rounds (OA, Tech, HR)"
        value={form.rounds}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <textarea
        name="description"
        placeholder="Experience details"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        rows="4"
        required
      />

      <select
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Experience"}
      </button>
    </form>
  );
};

export default AddInterviewExperience;
