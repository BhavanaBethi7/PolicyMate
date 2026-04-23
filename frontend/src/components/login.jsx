import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/login",
        form
      );

      // Check if user exists and handle accordingly
      if (res.data.exists === false) {
        // User doesn't exist - redirect to registration
        alert("User not found. Please register first.");
        navigate("/register");
        return;
      }

      // User exists - proceed with login
      localStorage.setItem("token", res.data.token);
      
      // Check if user is admin and redirect accordingly
      if (res.data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      
      // Handle specific cases
      if (err.response?.data?.exists === false) {
        alert("User not found. Please register first.");
        navigate("/register");
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "/api/auth/google-login",
        {
          tokenId: credentialResponse.credential
        }
      );

      if (res.data.success || res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        // Check if user is admin and redirect accordingly
        if (res.data.user?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        alert(res.data.message || "Google login failed");
      }
    } catch (err) {
      console.error('Google login error:', err);
      alert(err.response?.data?.message || err.response?.data?.error || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-gradient-to-r from-blue-200 to-indigo-300 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-r from-orange-200 to-orange-300 opacity-20 blur-3xl rounded-full"></div>

      {/* Card */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-[420px] overflow-hidden transform transition-all duration-500 hover:shadow-3xl">

        {/* 🇮🇳 Enhanced TOP STRIP */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-green-500"></div>

        <div className="p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Login to continue to PolicyMate
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <button
              disabled={loading}
              className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
            >
              <span className="relative z-10">{loading ? "Logging in..." : "Login"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
            </button>
          </form>

          {/* Enhanced Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium text-gray-500 px-3">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          {/* Enhanced Google Login */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center p-1 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors duration-200">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Login Failed")}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all duration-200 transform hover:scale-105 inline-block"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-green-500">🔒</span>
                Secure login
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-500">✓</span>
                Verified by Google
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}