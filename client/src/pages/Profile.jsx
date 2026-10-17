import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, logout } from "../redux/slices/authSlice";
import { removeToken, getToken } from "../utils/Auth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import {
  getMyInterviewExperiences,
  updateInterviewExperience,
  deleteInterviewExperience,
} from "../services/interviewExperienceApi";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [formData, setFormData] = useState({ name: "" });
  const [apiKeys, setApiKeys] = useState({ gemini: false, openai: false });
  const [apiKeyInputs, setApiKeyInputs] = useState({ gemini: "", openai: "" });
  const [editingKeys, setEditingKeys] = useState({ gemini: false, openai: false });
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeySaving, setApiKeySaving] = useState("");
  const [apiKeyMessage, setApiKeyMessage] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [embeddingConfig, setEmbeddingConfig] = useState({
    provider: "gemini",
    model: "gemini-embedding-001",
    keyConfigured: false,
  });
  const [embeddingKey, setEmbeddingKey] = useState("");
  const [embeddingEditing, setEmbeddingEditing] = useState(false);
  const [embeddingLoading, setEmbeddingLoading] = useState(true);
  const [embeddingSaving, setEmbeddingSaving] = useState(false);
  const [embeddingTesting, setEmbeddingTesting] = useState(false);
  const [embeddingMessage, setEmbeddingMessage] = useState("");
  const [embeddingError, setEmbeddingError] = useState("");

  // 🔹 Interview experience states
  const [myExperiences, setMyExperiences] = useState([]);
  const [editingExp, setEditingExp] = useState(null);

  const [showExperiences, setShowExperiences] = useState(false);
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- Profile Data ---------------- */
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    const fetchEmbeddingConfig = async () => {
      try {
        const { data } = await api.get("/api/user/profile/embedding-config");
        setEmbeddingConfig(data.config);
      } catch {
        setEmbeddingError("Unable to load embedding configuration.");
      } finally {
        setEmbeddingLoading(false);
      }
    };

    if (user) fetchEmbeddingConfig();
  }, [user]);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const { data } = await api.get("/api/user/profile/api-keys");
        setApiKeys(data.apiKeys);
      } catch {
        setApiKeyError("Unable to load API key settings.");
      } finally {
        setApiKeyLoading(false);
      }
    };

    if (user) fetchApiKeys();
  }, [user]);

  const handleApiKeySave = async (provider) => {
    const value = apiKeyInputs[provider].trim();
    setApiKeyMessage("");
    setApiKeyError("");

    if (!value) {
      setApiKeyError(`Enter a ${provider === "gemini" ? "Gemini" : "OpenAI"} API key.`);
      return;
    }

    setApiKeySaving(provider);
    try {
      const { data } = await api.put("/api/user/profile/api-keys", {
        [provider]: value,
      });
      setApiKeys(data.apiKeys);
      setApiKeyInputs((current) => ({ ...current, [provider]: "" }));
      setEditingKeys((current) => ({ ...current, [provider]: false }));
      setApiKeyMessage(
        `${provider === "gemini" ? "Gemini" : "OpenAI"} API key saved successfully.`,
      );
    } catch (error) {
      setApiKeyError(error.response?.data?.message || "Unable to save API key.");
    } finally {
      setApiKeySaving("");
    }
  };

  const handleApiKeyRemove = async (provider) => {
    setApiKeySaving(provider);
    setApiKeyMessage("");
    setApiKeyError("");
    try {
      const { data } = await api.delete(`/api/user/profile/api-keys/${provider}`);
      setApiKeys(data.apiKeys);
      setEditingKeys((current) => ({ ...current, [provider]: false }));
      setApiKeyMessage(
        `${provider === "gemini" ? "Gemini" : "OpenAI"} API key removed.`,
      );
    } catch (error) {
      setApiKeyError(error.response?.data?.message || "Unable to remove API key.");
    } finally {
      setApiKeySaving("");
    }
  };

  const handleEmbeddingSave = async () => {
    setEmbeddingMessage("");
    setEmbeddingError("");
    if (!embeddingConfig.provider || !embeddingConfig.model) {
      setEmbeddingError("Select a supported embedding provider and model.");
      return;
    }
    if (!embeddingConfig.keyConfigured && !embeddingKey.trim()) {
      setEmbeddingError("Enter an embedding API key before saving.");
      return;
    }

    setEmbeddingSaving(true);
    try {
      const { data } = await api.put("/api/user/profile/embedding-config", {
        provider: embeddingConfig.provider,
        model: embeddingConfig.model,
        ...(embeddingKey.trim() ? { apiKey: embeddingKey.trim() } : {}),
      });
      setEmbeddingConfig(data.config);
      setEmbeddingKey("");
      setEmbeddingEditing(false);
      setEmbeddingMessage("Embedding configuration saved successfully.");
    } catch (error) {
      setEmbeddingError(
        error.response?.data?.message || "Unable to save embedding configuration.",
      );
    } finally {
      setEmbeddingSaving(false);
    }
  };

  const handleEmbeddingRemove = async () => {
    setEmbeddingSaving(true);
    setEmbeddingMessage("");
    setEmbeddingError("");
    try {
      const { data } = await api.delete("/api/user/profile/embedding-config");
      setEmbeddingConfig(data.config);
      setEmbeddingKey("");
      setEmbeddingEditing(false);
      setEmbeddingMessage("Embedding configuration removed.");
    } catch (error) {
      setEmbeddingError(
        error.response?.data?.message || "Unable to remove embedding configuration.",
      );
    } finally {
      setEmbeddingSaving(false);
    }
  };

  const handleEmbeddingTest = async () => {
    setEmbeddingTesting(true);
    setEmbeddingMessage("");
    setEmbeddingError("");
    try {
      const { data } = await api.post("/api/user/profile/embedding-config/test");
      setEmbeddingMessage(
        `${data.message} Vector dimension: ${data.dimension}.`,
      );
    } catch (error) {
      setEmbeddingError(
        error.response?.data?.message || "Embedding configuration test failed.",
      );
    } finally {
      setEmbeddingTesting(false);
    }
  };

  /* ---------------- Fetch My Experiences ---------------- */
  useEffect(() => {
    const fetchMyExperiences = async () => {
      try {
        const { data } = await getMyInterviewExperiences();
        setMyExperiences(data);
      } catch (err) {
        console.error("Failed to load interview experiences");
      }
    };

    if (user) fetchMyExperiences();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------- Avatar Update ---------------- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = getToken();
        const res = await api.put(
          "/api/user/profile",
          { avatar: reader.result },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        dispatch(updateProfile({ avatar: res.data.user.avatar }));
        setAvatarPreview(res.data.user.avatar);
      } catch {
        alert("Failed to update profile picture");
      }
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- Profile Update ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");

    try {
      const token = getToken();
      const profileData = {
        name: formData.name.trim(),
      };
      const { data } = await api.put("/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateProfile(data.user));
      setIsEditing(false);
    } catch (error) {
      setProfileError(
        error.response?.status === 409
          ? "Email is already registered with another account"
          : "Failed to update profile",
      );
    }
  };

  /* ---------------- Delete Account ---------------- */
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(logout());
      removeToken();
      window.location.href = "/login";
    } catch {
      alert("Failed to delete account");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        Please login to view your profile.
      </div>
    );
  }

  const stats = user.stats || {};
  const formatCount = (count, s, p) => {
    const v = count ?? 0;
    return `${v} ${v > 1 ? p : s}`;
  };
  const totalPages = Math.ceil(myExperiences.length / ITEMS_PER_PAGE);

  const paginatedExperiences = myExperiences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-gray-50 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <img
              src={
                avatarPreview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name,
                )}&background=000&color=fff`
              }
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border mx-auto"
            />
            <label className="block mt-2 text-sm cursor-pointer font-medium">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-4 py-2 rounded">
              Edit Profile
            </button>
          </div>
        </div>

        {/* ================= ACTIVITY ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ActivityCard
            title="Interview Practice"
            value={formatCount(stats.interviewSessions, "Session", "Sessions")}
          />
          <ActivityCard
            title="Quiz Practice"
            value={formatCount(stats.quizSessions, "Session", "Sessions")}
          />
          <ActivityCard
            title="Daily Coding Streak"
            value={formatCount(stats.dailyCodingStreak, "Day", "Days")}
          />
        </div>

        {/* ================= API KEY SETTINGS ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-1">API Key Settings</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your keys are encrypted before storage and are never shown again after saving.
          </p>

          {apiKeyLoading ? (
            <p className="text-sm text-gray-500">Loading API key settings...</p>
          ) : (
            <div className="space-y-5">
              {["gemini", "openai"].map((provider) => {
                const label = provider === "gemini" ? "Google Gemini" : "OpenAI";
                const configured = apiKeys[provider];
                return (
                  <div key={provider} className="border rounded p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-medium">{label}</h4>
                        <p className="text-xs text-gray-500">
                          {configured ? "Configured" : "Not configured"}
                        </p>
                      </div>
                      {configured && (
                        <button
                          type="button"
                          onClick={() => handleApiKeyRemove(provider)}
                          disabled={apiKeySaving === provider}
                          className="text-sm text-red-600 disabled:opacity-50">
                          {apiKeySaving === provider ? "Removing..." : "Remove"}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {configured && !editingKeys[provider] ? (
                        <div className="flex-1 flex items-center border rounded text-sm px-3 py-2 min-w-0">
                          <span className="truncate flex-1 font-mono">
                            {"********"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 flex">
                          <input
                            type="password"
                            value={apiKeyInputs[provider]}
                            onChange={(e) =>
                              setApiKeyInputs((current) => ({
                                ...current,
                                [provider]: e.target.value,
                              }))
                            }
                            placeholder={
                              configured
                                ? "Enter a new key to replace it"
                                : "Paste your API key"
                            }
                            autoComplete="off"
                            className="w-full border px-3 py-2 rounded text-sm"
                          />
                        </div>
                      )}
                      {configured && !editingKeys[provider] && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingKeys((current) => ({
                              ...current,
                              [provider]: true,
                            }))
                          }
                          className="border px-4 py-2 rounded text-sm">
                          Replace
                        </button>
                      )}
                      {(!configured || editingKeys[provider]) && (
                        <button
                          type="button"
                          onClick={() => handleApiKeySave(provider)}
                          disabled={apiKeySaving === provider}
                          className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50">
                          {apiKeySaving === provider
                            ? "Saving..."
                            : configured
                              ? "Update"
                              : "Save"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {apiKeyMessage && <p className="text-sm text-green-600">{apiKeyMessage}</p>}
              {apiKeyError && <p className="text-sm text-red-600">{apiKeyError}</p>}
            </div>
          )}
        </div>

        {/* ================= EMBEDDING MODEL CONFIGURATION ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-1">Embedding Model Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            This configuration is separate from your Gemini/OpenAI LLM keys and
            is used only for repository indexing and search.
          </p>

          {embeddingLoading ? (
            <p className="text-sm text-gray-500">
              Loading embedding configuration...
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="block font-medium mb-1">Provider</span>
                  <select
                    value={embeddingConfig.provider || "gemini"}
                    onChange={(e) =>
                      setEmbeddingConfig((current) => ({
                        ...current,
                        provider: e.target.value,
                      }))
                    }
                    className="w-full border px-3 py-2 rounded">
                    <option value="gemini">Google Gemini</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block font-medium mb-1">Embedding model</span>
                  <select
                    value={embeddingConfig.model || "gemini-embedding-001"}
                    onChange={(e) =>
                      setEmbeddingConfig((current) => ({
                        ...current,
                        model: e.target.value,
                      }))
                    }
                    className="w-full border px-3 py-2 rounded">
                    <option value="gemini-embedding-001">
                      gemini-embedding-001
                    </option>
                    <option value="text-embedding-004">
                      text-embedding-004
                    </option>
                  </select>
                </label>
              </div>

              <div className="border rounded p-4">
                <p className="text-sm font-medium mb-1">
                  {embeddingConfig.keyConfigured
                    ? "Embedding API key configured"
                    : "Embedding API key required"}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Saved keys are encrypted and masked. Enter a new key only to
                  replace the existing one.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {embeddingConfig.keyConfigured && !embeddingEditing ? (
                    <div className="flex-1 border rounded text-sm px-3 py-2 font-mono">
                      ********
                    </div>
                  ) : (
                    <input
                      type="password"
                      value={embeddingKey}
                      onChange={(e) => setEmbeddingKey(e.target.value)}
                      placeholder={
                        embeddingConfig.keyConfigured
                          ? "Enter a new Gemini embedding key"
                          : "Paste your Gemini embedding key"
                      }
                      autoComplete="off"
                      className="flex-1 border px-3 py-2 rounded text-sm"
                    />
                  )}
                  {embeddingConfig.keyConfigured && !embeddingEditing ? (
                    <button
                      type="button"
                      onClick={() => setEmbeddingEditing(true)}
                      className="border px-4 py-2 rounded text-sm">
                      Replace
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEmbeddingSave}
                      disabled={embeddingSaving}
                      className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50">
                      {embeddingSaving ? "Saving..." : "Save"}
                    </button>
                  )}
                  {embeddingConfig.keyConfigured && (
                    <button
                      type="button"
                      onClick={handleEmbeddingRemove}
                      disabled={embeddingSaving}
                      className="border border-red-500 text-red-600 px-4 py-2 rounded text-sm disabled:opacity-50">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleEmbeddingTest}
                  disabled={embeddingTesting || !embeddingConfig.keyConfigured}
                  className="border px-4 py-2 rounded text-sm disabled:opacity-50">
                  {embeddingTesting ? "Testing..." : "Test Configuration"}
                </button>
              </div>
              {embeddingMessage && (
                <p className="text-sm text-green-600">{embeddingMessage}</p>
              )}
              {embeddingError && (
                <p className="text-sm text-red-600">{embeddingError}</p>
              )}
            </div>
          )}
        </div>

        {/*==============HEADING AND SHOW BUTTON=======*/}

        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold">My Interview Experiences</h3>

          {/* Show / Hide */}
          <button
            onClick={() => {
              setShowExperiences(!showExperiences);
              setCurrentPage(1);
            }}
            className={`text-xs px-3 py-1 rounded transition
      ${
        showExperiences
          ? "border border-gray-400 text-gray-700"
          : "bg-black text-white hover:bg-gray-900"
      }`}>
            {showExperiences ? "Hide" : "Show"}
          </button>

          {/* Add Experience */}
          <button
            onClick={() => navigate("/interview-experiences")}
            className="text-xs px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition">
            + Add Experience
          </button>
        </div>

        {/* ================= MY INTERVIEW EXPERIENCES ================= */}
        {showExperiences && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-4">
            {myExperiences.length === 0 ? (
              <p className="text-gray-500 text-sm">
                You have not added any interview experiences yet.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedExperiences.map((exp) => (
                    <div key={exp._id} className="border p-4 rounded">
                      <h4 className="font-medium">
                        {exp.companyName} – {exp.role}
                      </h4>

                      <p className="text-sm text-gray-600 mb-2">{exp.rounds}</p>
                      <p className="text-sm text-gray-700">{exp.description}</p>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => setEditingExp(exp)}
                          className="px-3 py-1 border rounded text-sm">
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            await deleteInterviewExperience(exp._id);
                            setMyExperiences(
                              myExperiences.filter((e) => e._id !== exp._id),
                            );
                          }}
                          className="px-3 py-1 border border-red-500 text-red-600 rounded text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className={`px-3 py-1 border rounded text-sm
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}>
                      Previous
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className={`px-3 py-1 border rounded text-sm
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}>
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================= DANGER ZONE ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-red-200">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Account
          </button>
        </div>

        {/* ================= EDIT EXPERIENCE MODAL ================= */}
        {editingExp && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="font-semibold mb-4">Edit Interview Experience</h3>

              <textarea
                value={editingExp.description}
                onChange={(e) =>
                  setEditingExp({ ...editingExp, description: e.target.value })
                }
                className="w-full border p-2 rounded mb-4"
                rows="4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const { data } = await updateInterviewExperience(
                      editingExp._id,
                      { description: editingExp.description },
                    );
                    setMyExperiences(
                      myExperiences.map((e) => (e._id === data._id ? data : e)),
                    );
                    setEditingExp(null);
                  }}
                  className="bg-black text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT PROFILE MODAL ================= */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="font-semibold mb-4">Update Profile</h3>

              {profileError && (
                <p className="text-red-600 text-sm mb-4">{profileError}</p>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= DELETE ACCOUNT MODAL ================= */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="font-semibold mb-4 text-red-600">
                Confirm Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to permanently delete your account?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityCard({ title, value }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );
}
