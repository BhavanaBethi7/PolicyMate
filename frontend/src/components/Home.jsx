import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Header with Profile */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to PolicyMate
        </h1>
        
        {/* Profile Icon with Dropdown */}
        {isComplete && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-blue-100 text-gray-700 hover:text-gray-900 transition-colors rounded-full w-10 h-10 flex items-center justify-center"
            >
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{profile?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{profile?.educationLevel} - {profile?.course}</p>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('viewProfile', 'true');
                      navigate("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("profile");
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* ❌ PROFILE NOT COMPLETE */}
      {!isComplete && (
        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-md mb-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Complete Your Profile
          </h2>

          <p className="text-gray-500 mb-4">
            Add a few required details to unlock personalized scheme recommendations.
          </p>

          <button
            onClick={() => navigate("/profile")}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Setup Profile
          </button>
        </div>
      )}

      {/* DASHBOARD (ONLY AFTER PROFILE COMPLETE) */}
      {isComplete && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* ELIGIBILITY */}
          <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-md transition">
            <h2 className="font-semibold text-lg mb-2">
              Check Eligibility
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              View schemes based on your saved profile
            </p>

            <button
              onClick={() => navigate("/eligibility")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              View Schemes
            </button>
          </div>

          {/* TEMP CHECK */}
          <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-md transition">
            <h2 className="font-semibold text-lg mb-2">
              Try Different Profile
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              Check eligibility without saving details
            </p>

            <button
              onClick={() => navigate("/check")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Check Policies
            </button>
          </div>

        </div>
      )}
    </div>
  );
}