import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    category: "",
    state: "",
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
    // Check if we're in view mode (from "View Profile" click)
    const isViewMode = localStorage.getItem('viewProfile') === 'true';
    setIsEditMode(!isViewMode);
    
    fetchProfile();
    
    // Clear the flag
    if (isViewMode) {
      localStorage.removeItem('viewProfile');
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetch profile - Token found:", token ? "Yes" : "No");
      if (!token) return;

      console.log("Fetching profile from backend...");
      const response = await axios.get("/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetch profile response:", response.data);

      if (response.data.success) {
        console.log("✅ Frontend: Response success = true");
        const fetchedProfile = response.data.profile;
        console.log("✅ Frontend: Fetched profile:", fetchedProfile);
        
        // If no profile exists, use empty values
        if (!fetchedProfile) {
          console.log("❌ Frontend: No profile found, using defaults");
          setProfile({
            name: "",
            age: "",
            gender: "",
            category: "",
            state: "",
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
          return;
        }
        
        console.log("✅ Frontend: About to setProfile with data");
        // Merge with default values to handle undefined fields
        const profileData = {
          name: fetchedProfile.name || "",
          age: fetchedProfile.age || "",
          gender: fetchedProfile.gender || "",
          category: fetchedProfile.category || "",
          state: fetchedProfile.state || "",
          placeOfBirth: fetchedProfile.placeOfBirth || "",
          locationType: fetchedProfile.locationType || "",
          educationLevel: fetchedProfile.educationLevel || "",
          course: fetchedProfile.course || "",
          passingYear: fetchedProfile.passingYear || "",
          income: fetchedProfile.income || "",
          preferredSector: fetchedProfile.preferredSector || [],
          otherSector: fetchedProfile.otherSector || "",
          lookingFor: fetchedProfile.lookingFor || []
        };
        console.log("✅ Frontend: Setting profile with:", profileData);
        setProfile(profileData);
        console.log("✅ Frontend: Profile state updated");
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

  const handleSectorChange = (e) => {
    if (!isEditMode) return;
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setProfile({ ...profile, preferredSector: selected });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    console.log("=== SAVE PROFILE ===");
    console.log("Profile data:", profile);

    try {
      const token = localStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        setError("Please login to save your profile");
        setLoading(false);
        return;
      }

      console.log("Sending to /api/profile/save...");
      const response = await axios.post("/api/profile/save", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      console.log("Response received:", response.status, response.data);

      if (response.data.success) {
  console.log("✅ Profile saved successfully");

  console.log("BEFORE NAVIGATE");
navigate("/home");
console.log("AFTER NAVIGATE");
}else {
        console.log("Save failed:", response.data.message);
        setError(response.data.message || "Failed to save profile");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error.message);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      setError(`Error: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const input = isEditMode 
    ? "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
    : "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed";

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center flex-1">
          {isEditMode ? "Edit Profile" : "View Profile"}
        </h1>
        
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* 🔴 MANDATORY SECTION */}
        <div className="bg-white border-l-4 border-orange-400 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Required Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <select 
              name="educationLevel" 
              value={profile.educationLevel} 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            >
              <option value="">Education Level *</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>

            <input 
              name="course" 
              value={profile.course} 
              placeholder="Field of Study *" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />

            <input 
              name="state" 
              value={profile.state} 
              placeholder="State *" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />

            <input 
              name="income" 
              value={profile.income} 
              placeholder="Annual Income *" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />

            <select 
              name="category" 
              value={profile.category} 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            >
              <option value="">Category *</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        {/* PERSONAL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input 
              name="name" 
              value={profile.name} 
              placeholder="Full Name" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />
            <input 
              name="age" 
              value={profile.age} 
              placeholder="Age" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />

            <select 
              name="gender" 
              value={profile.gender} 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* LOCATION */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Location</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input 
              name="placeOfBirth" 
              value={profile.placeOfBirth} 
              placeholder="Place of Birth" 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            />

            <select 
              name="locationType" 
              value={profile.locationType} 
              onChange={handleChange} 
              className={input}
              disabled={!isEditMode}
            >
              <option value="">Urban / Rural</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>
        </div>

        {/* CAREER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Career Preferences</h2>

          {/* SECTOR */}
          <div className="mb-4">
            <p className="mb-2 font-medium">Preferred Sector</p>

            <select
              multiple
              value={profile.preferredSector}
              onChange={handleSectorChange}
              className={`${input} h-32`}
              disabled={!isEditMode}
            >
              <option value="IT">IT</option>
              <option value="Government">Government</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Research">Research</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>

            {profile.preferredSector.includes("Other") && (
              <input
                placeholder="Enter other sector"
                value={profile.otherSector}
                onChange={(e) =>
                  setProfile({ ...profile, otherSector: e.target.value })
                }
                className={`${input} mt-3`}
                disabled={!isEditMode}
              />
            )}
          </div>

          {/* LOOKING FOR */}
          <div>
            <p className="mb-2 font-medium">Looking For</p>

            <div className="flex flex-wrap gap-3">
              {["Scholarship", "Internship", "Govt Job", "Training Program"].map((item) => (
                <label 
                  key={item} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                    isEditMode ? 'bg-gray-50' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile.lookingFor.includes(item)}
                    onChange={() => handleMultiSelect("lookingFor", item)}
                    disabled={!isEditMode}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* SAVE BUTTON - Only show in edit mode */}
        {isEditMode && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        )}

      </div>
    </div>
  );
}