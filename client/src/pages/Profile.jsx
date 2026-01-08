import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, logout } from "../redux/slices/authSlice";
import { removeToken } from "../utils/Auth";
import axios from "axios";
import { getToken } from "../utils/Auth";


export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });

      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    try {
      const token = getToken();

      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        { avatar: reader.result },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update Redux using backend response
      dispatch(updateProfile({ avatar: res.data.user.avatar }));
      setAvatarPreview(res.data.user.avatar);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile picture");
    }
  };

  reader.readAsDataURL(file);
};


  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(logout());
      removeToken();
      window.location.href = "/login";
    } catch (error) {
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

 const formatCount = (count, singular, plural) => {
  const value = count ?? 0;
  return `${value} ${value > 1 ? plural : singular}`;
};


  return (
    <div className="bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6">
          <div className="text-center">
            <img
  src={
    avatarPreview ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=000&color=fff`
  }
  alt="Profile"
  className="w-24 h-24 rounded-full object-cover border"
/>

            <label className="block mt-2 text-sm cursor-pointer font-medium text-black">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
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

        {/* Activity Section */}
        <div className="grid md:grid-cols-3 gap-6">
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

       

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-lg shadow border border-red-200">
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

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="font-semibold mb-4">Update Profile</h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
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
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
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
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );
}
