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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 🔴 MANDATORY SECTION */}
        <div className="bg-white border-l-4 border-blue-500 p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="mr-2 text-blue-500">📋</span> Required Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <select name="educationLevel" value={profile.educationLevel} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
              <option value="">Education Level *</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>

            <input name="course" value={profile.course} placeholder="Field of Study (e.g. B.Tech CS) *" onChange={handleChange} className={inputClass} disabled={!isEditMode} />

            <select name="gender" value={profile.gender} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
              <option value="">Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select name="category" value={profile.category} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
              <option value="">Category *</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>

            <input name="income" value={profile.income} placeholder="Annual Family Income *" onChange={handleChange} className={inputClass} disabled={!isEditMode} />

            {/* State selection */}
            <select name="state" value={profile.state} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
              <option value="">Current State of Residence *</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* 📍 LOCATION PREFERENCES */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Job/Scholarship Location Preference</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">1st Preferred State</label>
              <select name="prefState1" value={profile.prefState1} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">2nd Preferred State</label>
              <select name="prefState2" value={profile.prefState2} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 🚀 CAREER PREFERENCES */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Interests & Career</h2>

          <div className="mb-8">
            <p className="mb-4 font-semibold text-gray-700">Preferred Sectors (Select multiple)</p>
            <div className="flex flex-wrap gap-3">
              {SECTORS.map((sector) => (
                <label key={sector} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                  profile.preferredSector.includes(sector) 
                  ? 'bg-blue-50 border-blue-400 text-blue-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${!isEditMode && 'opacity-70 cursor-not-allowed'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={profile.preferredSector.includes(sector)}
                    onChange={() => handleMultiSelect("preferredSector", sector)}
                    disabled={!isEditMode}
                  />
                  {sector}
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
            <p className="mb-4 font-semibold text-gray-700">I am looking for:</p>
            <div className="flex flex-wrap gap-4">
              {["Scholarship", "Internship", "Govt Job", "Training Program"].map((item) => (
                <label key={item} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                    profile.lookingFor.includes(item) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {profile.lookingFor.includes(item) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={profile.lookingFor.includes(item)}
                    onChange={() => handleMultiSelect("lookingFor", item)}
                    disabled={!isEditMode}
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PERSONAL DETAILS (REMAINING) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Additional Details</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <input name="name" value={profile.name} placeholder="Full Name" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            <input name="age" value={profile.age} placeholder="Age" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            <input name="placeOfBirth" value={profile.placeOfBirth} placeholder="Place of Birth" onChange={handleChange} className={inputClass} disabled={!isEditMode} />
            <select name="locationType" value={profile.locationType} onChange={handleChange} className={inputClass} disabled={!isEditMode}>
              <option value="">Urban / Rural</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-center font-medium">{error}</div>}

        {isEditMode && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Save My Profile"}
          </button>
        )}
      </div>
    </div>
  );
}