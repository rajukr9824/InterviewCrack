import { useEffect, useState, useCallback } from "react";
import { getInterviewExperiences } from "../services/interviewExperienceApi";
import InterviewExperienceCard from "../components/InterviewExperienceCard";
import AddInterviewExperience from "../components/AddInterviewExperience";

const InterviewExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Memoized function (ESLint safe)
  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getInterviewExperiences(company);
      setExperiences(data);
    } catch (err) {
      setError("Failed to load interview experiences");
    } finally {
      setLoading(false);
    }
  }, [company]);

  // ✅ ESLint-compliant useEffect
  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Interview Experiences
      </h1>

      <input
        type="text"
        placeholder="Search by company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Re-fetch after successful post */}
      <AddInterviewExperience onSuccess={loadExperiences} />

      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Loading experiences...
        </p>
      )}

      {error && (
        <p className="text-center mt-6 text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && experiences.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No interview experiences found
        </p>
      )}

      <div className="space-y-4 mt-6">
        {experiences.map((exp) => (
          <InterviewExperienceCard key={exp._id} exp={exp} />
        ))}
      </div>
    </div>
  );
};

export default InterviewExperience;
