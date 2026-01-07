import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import { setToken } from "../utils/Auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      if (res.data.token) {
        setToken(res.data.token);
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">LOGIN</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:border-black outline-none transition"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:border-black outline-none transition"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded text-white font-bold tracking-wide transition-all ${
                loading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "PROCESSING..." : "LOGIN"}
            </button>
          </div>
        </form>

        {/* NEW: REGISTRATION PROMPT */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-black font-bold hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}