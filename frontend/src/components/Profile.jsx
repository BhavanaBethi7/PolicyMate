import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// List of Indian States for the dropdowns
const INDIAN_STATES = [
  "Any", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const SECTORS = ["IT", "Government", "Core Engineering", "Research", "Healthcare", "Education", "Finance", "Other"];

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    category: "",
    state: "", // Current Residence
    prefState1: "", // Added
    prefState2: "", // Added
    placeOfBirth: "",
    locationType: "",
    educationLevel: "",
    course: "",
    passingYear: "",
    income: "",
    preferredSector: [],
    otherSector: "",
    lookingFor: []
  });
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isViewMode = localStorage.getItem('viewProfile') === 'true';
    setIsEditMode(!isViewMode);
    fetchProfile();
    if (isViewMode) localStorage.removeItem('viewProfile');
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.profile) {
        const fetchedProfile = response.data.profile;
        setProfile({
          ...profile,
          ...fetchedProfile,
          preferredSector: fetchedProfile.preferredSector || [],
          lookingFor: fetchedProfile.lookingFor || []
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    if (!isEditMode) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (field, value) => {
    if (!isEditMode) return;
    let updated = [...profile[field]];
    updated.includes(value)
      ? (updated = updated.filter((v) => v !== value))
      : updated.push(value);
    setProfile({ ...profile, [field]: updated });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to save your profile");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/profile/save", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.data.success) {
        alert("Profile saved successfully!");
        navigate("/home");
      } else {
        setError(response.data.message || "Failed to save profile");
        setLoading(false);
      }
    } catch (error) {
      setError(`Error: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const inputClass = isEditMode 
    ? "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all"
    : "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed";

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Enhanced MANDATORY SECTION */}
        <div className="bg-white/80 backdrop-blur-xl border-l-4 border-blue-500 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Required Information</h2>
              <p className="text-gray-600 mt-1">These details are essential for accurate scheme matching</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Education Level *</label>
              <select name="educationLevel" value={profile.educationLevel} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select Education Level</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Field of Study *</label>
              <input name="course" value={profile.course} placeholder="e.g. B.Tech Computer Science" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Gender *</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category *</label>
              <select name="category" value={profile.category} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Annual Family Income *</label>
              <input name="income" value={profile.income} placeholder="e.g. 3,00,000" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Current State *</label>
              <select name="state" value={profile.state} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced LOCATION PREFERENCES */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Location Preferences</h2>
              <p className="text-gray-600 mt-1">Where would you prefer to work/study?</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">1st Preferred State</label>
              <select name="prefState1" value={profile.prefState1} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">2nd Preferred State</label>
              <select name="prefState2" value={profile.prefState2} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced CAREER PREFERENCES */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Interests & Career</h2>
              <p className="text-gray-600 mt-1">Tell us about your career preferences</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-4 font-bold text-gray-700">Preferred Sectors (Select multiple)</p>
            <div className="flex flex-wrap gap-3">
              {SECTORS.map((sector) => (
                <label key={sector} className={`group flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  profile.preferredSector.includes(sector) 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-700 shadow-md' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${!isEditMode && 'opacity-70 cursor-not-allowed'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={profile.preferredSector.includes(sector)}
                    onChange={() => handleMultiSelect("preferredSector", sector)}
                    disabled={!isEditMode}
                  />
                  <span className="font-medium">{sector}</span>
                </label>
              ))}
            </div>
            {profile.preferredSector.includes("Other") && (
              <input
                placeholder="Please specify other sector"
                value={profile.otherSector}
                onChange={(e) => setProfile({ ...profile, otherSector: e.target.value })}
                className={`${inputClass} mt-4`}
                disabled={!isEditMode}
              />
            )}
          </div>

          <div>
            <p className="mb-4 font-bold text-gray-700">I am looking for:</p>
            <div className="flex flex-wrap gap-4">
              {["Scholarship", "Internship", "Govt Job", "Training Program"].map((item) => (
                <label key={item} className="group flex items-center gap-3 cursor-pointer">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    profile.lookingFor.includes(item) ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={profile.lookingFor.includes(item)}
                    onChange={() => handleMultiSelect("lookingFor", item)}
                    disabled={!isEditMode}
                  />
                  <span className="text-gray-700 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced PERSONAL DETAILS */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Additional Details</h2>
              <p className="text-gray-600 mt-1">Optional information to improve recommendations</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <input name="name" value={profile.name} placeholder="Enter your name" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Age</label>
              <input name="age" value={profile.age} placeholder="Enter your age" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Place of Birth</label>
              <input name="placeOfBirth" value={profile.placeOfBirth} placeholder="Enter birth place" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Location Type</label>
              <select name="locationType" value={profile.locationType} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select Location Type</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}

        {isEditMode && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="group w-full py-5 rounded-3xl text-white font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
              </svg>
              <span>{loading ? "Processing..." : "Save My Profile"}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        )}
      </div>
    </div>
  );
}