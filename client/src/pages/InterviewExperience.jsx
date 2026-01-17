import { useEffect, useState, useCallback } from "react";
import { getInterviewExperiences } from "../services/interviewExperienceApi";
import InterviewExperienceCard from "../components/InterviewExperienceCard";
import AddInterviewExperience from "../components/AddInterviewExperience";

const InterviewExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add Experience toggle
  const [showAddForm, setShowAddForm] = useState(false);

  // Pagination (BACKEND DRIVEN)
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getInterviewExperiences({
        company,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setExperiences(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load interview experiences");
    } finally {
      setLoading(false);
    }
  }, [company, currentPage]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Interview Experiences</h1>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-900 transition"
        >
          {showAddForm ? "Close" : "+ Add Experience"}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by company name"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Add Experience Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddInterviewExperience
            onSuccess={() => {
              setCurrentPage(1);
              loadExperiences();
              setShowAddForm(false);
            }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Loading experiences...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center mt-6 text-red-500">
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && experiences.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No interview experiences found
        </p>
      )}

      {/* List */}
      <div className="space-y-4 mt-6">
        {experiences.map((exp) => (
          <InterviewExperienceCard key={exp._id} exp={exp} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 border rounded text-sm
              ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 border rounded text-sm
              ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewExperience;
