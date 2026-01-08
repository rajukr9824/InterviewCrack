import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { setToken } from "../utils/Auth";
import api from "../api/axios";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", form);

      const { token, user } = res.data;

      if (token && user) {
        // save token (optional if using redux-persist)
        setToken(token);

        // 🔥 THIS WAS MISSING
        dispatch(
          loginSuccess({
            user,
            token,
          })
        );

        navigate("/profile");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Check credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            LOGIN
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:border-black outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:border-black outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded text-white font-bold ${
                loading ? "bg-gray-400" : "bg-black"
              }`}
            >
              {loading ? "PROCESSING..." : "LOGIN"}
            </button>
          </div>
        </form>

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
