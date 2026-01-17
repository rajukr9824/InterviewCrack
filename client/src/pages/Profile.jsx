import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, logout } from "../redux/slices/authSlice";
import { removeToken, getToken } from "../utils/Auth";
import axios from "axios";
import api from "../api/axios";

import {
  getMyInterviewExperiences,
  updateInterviewExperience,
  deleteInterviewExperience,
} from "../services/interviewExperienceApi";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "" });

  // 🔹 Interview experience states
  const [myExperiences, setMyExperiences] = useState([]);
  const [editingExp, setEditingExp] = useState(null);

  /* ---------------- Profile Data ---------------- */
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

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
          { headers: { Authorization: `Bearer ${token}` } }
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
  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  /* ---------------- Delete Account ---------------- */
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/user/profile", {
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
                  user.name
                )}&background=000&color=fff`
              }
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border mx-auto"
            />
            <label className="block mt-2 text-sm cursor-pointer font-medium">
              Change Photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ================= ACTIVITY ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ActivityCard title="Interview Practice" value={formatCount(stats.interviewSessions, "Session", "Sessions")} />
          <ActivityCard title="Quiz Practice" value={formatCount(stats.quizSessions, "Session", "Sessions")} />
          <ActivityCard title="Daily Coding Streak" value={formatCount(stats.dailyCodingStreak, "Day", "Days")} />
        </div>

        {/* ================= MY INTERVIEW EXPERIENCES ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">My Interview Experiences</h3>

          {myExperiences.length === 0 && (
            <p className="text-gray-500 text-sm">
              You have not added any interview experiences yet.
            </p>
          )}

          <div className="space-y-4">
            {myExperiences.map((exp) => (
              <div key={exp._id} className="border p-4 rounded">
                <h4 className="font-medium">
                  {exp.companyName} – {exp.role}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{exp.rounds}</p>
                <p className="text-sm text-gray-700">{exp.description}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditingExp(exp)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await deleteInterviewExperience(exp._id);
                      setMyExperiences(
                        myExperiences.filter((e) => e._id !== exp._id)
                      );
                    }}
                    className="px-3 py-1 border border-red-500 text-red-600 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-red-200">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
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
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const { data } = await updateInterviewExperience(
                      editingExp._id,
                      { description: editingExp.description }
                    );
                    setMyExperiences(
                      myExperiences.map((e) =>
                        e._id === data._id ? data : e
                      )
                    );
                    setEditingExp(null);
                  }}
                  className="bg-black text-white px-4 py-2 rounded"
                >
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

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded">
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
                <button onClick={() => setShowDeleteConfirm(false)} className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
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
