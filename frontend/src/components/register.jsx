import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">

      {/* Card */}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl w-96 overflow-hidden">

        {/* 🇮🇳 TOP STRIP */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-500"></div>

        <div className="p-8">

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Create Account
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Join SchemeSmart to get started
          </p>

          <form onSubmit={handleRegister} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />

            {/* ✅ KEEP BUTTON BLUE */}
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Divider (optional but keeps consistency) */}
          <div className="my-5 flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200"></div>
            OR
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer font-medium hover:underline"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}