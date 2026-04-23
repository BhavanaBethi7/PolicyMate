import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-6 py-8">

      {/* Enhanced animated background elements */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-blue-400/20 to-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/20 to-teal-500/20 blur-3xl rounded-full animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-purple-300/15 to-pink-400/15 blur-3xl rounded-full animate-pulse animation-delay-1000"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }}></div>

      <div className="relative max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT - Enhanced */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full shadow-lg">
              <span className="text-blue-700 text-sm font-bold flex items-center gap-2">
                <span className="text-lg">🇮🇳</span>
                <span>Made for India</span>
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Discover the Right
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                Government Schemes
              </span>
            </h1>

            <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg font-medium">
              Smart eligibility matching platform that helps you find scholarships, 
              internships, and opportunities tailored to your profile — instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/login")}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🚀</span>
                <span>Get Started</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-base hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                <span>✨</span>
                <span>Create Account</span>
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT FEATURE CARD - Enhanced */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 h-full max-h-[600px] flex flex-col">

          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-lg">🚀</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Why PolicyMate?
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 border border-transparent hover:border-orange-200">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Smart Matching</h3>
                <p className="text-gray-600 text-xs leading-relaxed">AI-powered eligibility-based scheme matching</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-transparent hover:border-blue-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Ranked Results</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Get schemes with match percentage scores</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 border border-transparent hover:border-emerald-200">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-sm">📋</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Clear Eligibility</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Detailed explanations of requirements</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">AI Assistant</h3>
                <p className="text-gray-600 text-xs leading-relaxed">Get guidance and answers to your queries</p>
              </div>
            </div>

          </div>

          {/* Enhanced Trust Badge */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="font-medium">Trusted by students across India</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}