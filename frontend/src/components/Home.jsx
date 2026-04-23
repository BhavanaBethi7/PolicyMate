import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Get user info from token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUser(tokenPayload);

      const response = await axios.get("/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);

        const complete =
          profileData?.educationLevel &&
          profileData?.course &&
          profileData?.state &&
          profileData?.income &&
          profileData?.category;

        setIsComplete(complete);
      }
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    // Still try to get user info from token even if profile fetch fails
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser(tokenPayload);
      } catch (tokenError) {
        console.error("Error parsing token:", tokenError);
      }
    }
  }

  // fallback
  const saved = JSON.parse(localStorage.getItem("profile"));
  if (saved) {
    setProfile(saved);

    const complete =
      saved.educationLevel &&
      saved.course &&
      saved.state &&
      saved.income &&
      saved.category;

    setIsComplete(complete);
  }

  // ✅ ALWAYS STOP LOADING
  setLoading(false);
};

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">

      {/* Enhanced Header with Profile */}
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900">
            Welcome to PolicyMate
          </h1>
          <p className="text-gray-600">Your gateway to government schemes</p>
        </div>
        
        {/* Enhanced Profile Icon with Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </button>
            
            {/* Enhanced Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 transform transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-lg">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('viewProfile', 'true');
                      navigate("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3"
                  >
                    <span className="text-blue-500">👤</span>
                    <span className="font-medium">View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("profile");
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                  >
                    <span>🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Enhanced PROFILE NOT COMPLETE Card */}
      {!isComplete && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">⚡</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Complete Your Profile
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Add a few required details to unlock personalized scheme recommendations.
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                <span className="relative z-10">Setup Profile</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced DASHBOARD (ONLY AFTER PROFILE COMPLETE) */}
      {isComplete && (
        <div className="space-y-8">
          {/* Welcome Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">30</span>
              </div>
              <p className="text-gray-600 font-medium">Schemes Available</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">85%</span>
              </div>
              <p className="text-gray-600 font-medium">Avg Match Score</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <p className="text-gray-600 font-medium">Active Deadlines</p>
            </div>
          </div>

          {/* Enhanced Action Cards */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* ELIGIBILITY CARD */}
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Check Eligibility
                  </h2>
                  <p className="text-gray-600 mt-1">View schemes based on your saved profile</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>AI-powered matching</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/eligibility")}
                className="group mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                <span className="relative z-10">View Schemes</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
              </button>
            </div>

            {/* TEMP CHECK CARD */}
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Try Different Profile
                  </h2>
                  <p className="text-gray-600 mt-1">Check eligibility without saving details</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-500">✓</span>
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-500">✓</span>
                  <span>Instant results</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/check")}
                className="group mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                <span className="relative z-10">Check Policies</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}