import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-6">

      {/* 🇮🇳 Subtle Indian color glows */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-orange-200 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-green-200 opacity-30 blur-3xl rounded-full"></div>

      <div className="relative max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Discover the Right
            <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-green-600 bg-clip-text text-transparent">
              {" "}Government Schemes
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Smart eligibility matching platform that helps you find scholarships,
            internships, and opportunities tailored to your profile — instantly.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 w-full bg-blue-600 text-white rounded-xl font-medium shadow-md hover:opacity-90 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* RIGHT FEATURE CARD */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Why choose SchemeSmart?
          </h2>

          <div className="space-y-5 text-gray-600">

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full"></div>
              <p>Smart eligibility-based scheme matching</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
              <p>Ranked results with match percentage</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
              <p>Clear explanation of eligibility</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
              <p>AI assistant for guidance & queries</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}