import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

export default function Check() {
  const [tempProfile, setTempProfile] = useState({
    educationLevel: '',
    course: '',
    state: '',
    income: '',
    category: '',
    age: '',
    gender: '',
    locationType: ''
  });
  
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "All",
    state: "All",
    minMatch: 0,
    searchQuery: "",
  });

  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleCheck = async () => {
    if (!tempProfile.educationLevel || !tempProfile.category || !tempProfile.state) {
      setError('Please fill in Education Level, Category, and State');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/ai/smart-search', {
        query: "Find eligible schemes",
        profile: tempProfile
      });

      if (response.data.success) {
        setSchemes(response.data.schemes || []);
        setShowResults(true);
      } else {
        setError(response.data.message || 'Failed to check eligibility');
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter((item) => {
      const scheme = item.scheme;
      if (!scheme) return false;

      const rawStates = scheme.eligibility?.states;
      const schemeStates = (Array.isArray(rawStates) ? rawStates : rawStates ? [rawStates] : [])
        .map(s => String(s).trim().toLowerCase());

      const selectedState = filters.state.toLowerCase().trim();
      
      let matchesState = false;
      if (filters.state === "All") {
        matchesState = true;
      } else if (filters.state === "All India") {
        matchesState = schemeStates.includes("all india");
      } else {
        matchesState = schemeStates.includes(selectedState);
      }

      const matchesCategory = filters.category === "All" || scheme.category === filters.category;
      const matchesSearch = (scheme.name || "").toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesMatch = (item.matchPercentage || 0) >= filters.minMatch;

      return matchesState && matchesCategory && matchesSearch && matchesMatch;
    });
  }, [schemes, filters]);

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  const resetForm = () => {
    setTempProfile({
      educationLevel: '',
      course: '',
      state: '',
      income: '',
      category: '',
      age: '',
      gender: '',
      locationType: ''
    });
    setSchemes([]);
    setShowResults(false);
    setError('');
  };

  if (!showResults) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-6">
              <span className="text-white text-3xl">🔍</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Quick Eligibility Check
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Check your eligibility for schemes without creating an account
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">📝</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600 mt-1">Fields marked with * are required for accurate results</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Education Level *</label>
                <select
                  name="educationLevel"
                  value={tempProfile.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                >
                  <option value="">Select Education</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Field of Study *</label>
                <input
                  type="text"
                  name="course"
                  value={tempProfile.course}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science, Medicine"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">State *</label>
                <select
                  name="state"
                  value={tempProfile.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Category *</label>
                <select
                  name="category"
                  value={tempProfile.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Annual Family Income</label>
                <input
                  type="text"
                  name="income"
                  value={tempProfile.income}
                  onChange={handleChange}
                  placeholder="e.g., 3,00,000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={tempProfile.age}
                  onChange={handleChange}
                  placeholder="e.g., 22"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={tempProfile.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Location Type</label>
                <select
                  name="locationType"
                  value={tempProfile.locationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all duration-200"
                >
                  <option value="">Select Location</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <span className="text-xl">⚠️</span>
                  <span className="font-bold">{error}</span>
                </div>
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button
                onClick={handleCheck}
                disabled={loading}
                className="group flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">🔍</span>
                  <span>{loading ? 'Checking...' : 'Check Eligibility'}</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
              </button>
              <button
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:-translate-y-1"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Want to save your profile and get personalized recommendations?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Create an account to save your profile, track applications, and get personalized scheme recommendations
              </p>
              <button
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>✨</span>
                  <span>Create Account</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Eligibility Results</h1>
            <p className="text-gray-600 text-sm mt-1">{filteredSchemes.length} schemes found</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={() => setShowResults(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Container */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Enhanced Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } bg-white/90 backdrop-blur-xl border-r border-gray-200 overflow-hidden transition-all duration-300 ease-in-out lg:w-80 shadow-2xl`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Search</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Scheme name..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none text-sm pl-10 transition-all duration-200"
                  />
                  <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Region</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer text-sm font-medium transition-all duration-200"
                  value={filters.state}
                  onChange={(e) => setFilters({...filters, state: e.target.value})}
                >
                  <option value="All">Any Region</option>
                  <option value="All India">Central Government</option>
                  <optgroup label="States / UTs">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Type</label>
                <div className="space-y-3">
                  {["All", "Scholarship", "Internship", "Govt Job", "Training Program"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters({...filters, category: cat})}
                      className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left flex items-center gap-3 ${
                        filters.category === cat 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">
                        {cat === "All" ? "🌟" : cat === "Scholarship" ? "🎓" : cat === "Internship" ? "💼" : cat === "Govt Job" ? "🏢" : "📚"}
                      </span>
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Min. Match: <span className="text-purple-600 font-bold">{filters.minMatch}%</span>
                </label>
                <div className="space-y-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={filters.minMatch}
                    onChange={(e) => setFilters({...filters, minMatch: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>0%</span>
                    <span>45%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: ''})}
                className="w-full px-4 py-3 text-sm font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 border-2 border-purple-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="max-w-5xl space-y-8">
            {filteredSchemes.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl mb-6">
                  <span className="text-white text-3xl">📭</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No eligible schemes found
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your filters to find more matching schemes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowResults(false)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Back to Form
                  </button>
                  <button
                    onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: ''})}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              filteredSchemes.map((item, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-md ${getMatchColor(item.matchPercentage)}`}>
                            🎯 {item.matchPercentage}% Match
                          </span>
                          <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-800 text-sm font-bold">
                            {item.scheme.category}
                          </span>
                          {item.scheme.featured && (
                            <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full text-yellow-800 text-sm font-bold">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {item.scheme.name}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {item.scheme.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                          <span className="text-green-500 text-xl">💰</span>
                          Benefits
                        </h4>
                        <ul className="space-y-3">
                          {(item.scheme.benefits || []).slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-700 font-medium">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                          <span className="text-purple-500 text-xl">🤖</span>
                          Why You're Eligible
                        </h4>
                        <ul className="space-y-3">
                          {(item.aiExplanation ? [item.aiExplanation] : []).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-700 font-medium">{detail}</span>
                            </li>
                          ))}
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-gray-700 font-medium">{item.matchPercentage}% match based on your profile</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedScheme(item.scheme)}
                        className="group flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span>📋</span>
                          <span>View Details</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
                      </button>
                      {item.scheme.applicationLink && (
                        <a
                          href={item.scheme.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>🚀</span>
                            <span>Apply Now</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-10 text-center border border-orange-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl mb-6">
              <span className="text-white text-2xl">💾</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Save Your Profile for Future Use
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Create an account to save your profile, track applications, and get personalized scheme recommendations
            </p>
            <button
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-orange-500 to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-xl">✨</span>
                <span>Create Free Account</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScheme.name}</h2>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedScheme.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <ul className="space-y-1">
                  {(selectedScheme.benefits || []).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedScheme.applicationProcess && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Application Process</h3>
                  <ol className="space-y-2">
                    {selectedScheme.applicationProcess.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step}
                        </span>
                        <span className="text-gray-600">{step.description}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {selectedScheme.amount && (
                  <div>
                    <span className="text-sm text-gray-500">Amount</span>
                    <p className="font-semibold text-gray-900">{selectedScheme.amount}</p>
                  </div>
                )}
                {selectedScheme.duration && (
                  <div>
                    <span className="text-sm text-gray-500">Duration</span>
                    <p className="font-semibold text-gray-900">{selectedScheme.duration}</p>
                  </div>
                )}
                {selectedScheme.lastDate && (
                  <div>
                    <span className="text-sm text-gray-500">Last Date</span>
                    <p className="font-semibold text-gray-900">{selectedScheme.lastDate}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {selectedScheme.officialLink && (
                  <a
                    href={selectedScheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-center"
                  >
                    Official Website
                  </a>
                )}
                {selectedScheme.applicationLink && (
                  <a
                    href={selectedScheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}