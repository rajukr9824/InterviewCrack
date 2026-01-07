import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import { setToken } from "../utils/Auth"; // Import setToken to auto-login

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      // OPTIONAL: Auto-login after registration
      if (res.data.token) {
        setToken(res.data.token);
        navigate("/interview");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 uppercase tracking-wide">
            CREATE ACCOUNT
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Create Password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
              required
            />

            <button
              disabled={loading}
              className={`w-full py-3 rounded text-white font-bold transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
          </div>
        </form>

        {/* NEW: SIGN-IN REDIRECT */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="text-black font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}