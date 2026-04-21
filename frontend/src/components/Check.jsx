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
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quick Eligibility Check
            </h1>
            <p className="text-gray-600 text-lg">
              Check your eligibility for schemes without creating an account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Basic Information
              </h2>
              <p className="text-gray-600 text-sm">
                Fields marked with * are required for accurate results
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level *
                </label>
                <select
                  name="educationLevel"
                  value={tempProfile.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                >
                  <option value="">Select Education</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  name="course"
                  value={tempProfile.course}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science, Medicine"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={tempProfile.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={tempProfile.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Family Income
                </label>
                <input
                  type="text"
                  name="income"
                  value={tempProfile.income}
                  onChange={handleChange}
                  placeholder="e.g., 3,00,000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={tempProfile.age}
                  onChange={handleChange}
                  placeholder="e.g., 22"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={tempProfile.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Type
                </label>
                <select
                  name="locationType"
                  value={tempProfile.locationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                >
                  <option value="">Select Location</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCheck}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check Eligibility'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Want to save your profile and get personalized recommendations?
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eligibility Results</h1>
            <p className="text-gray-600 text-sm mt-1">{filteredSchemes.length} schemes found</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={() => setShowResults(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-72' : 'w-0'
          } bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ease-in-out lg:w-72 shadow-lg`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-slate-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Search</label>
                <input 
                  type="text"
                  placeholder="Scheme name..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:bg-white focus:border-blue-300 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Region</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:bg-white focus:border-blue-300 outline-none cursor-pointer text-sm"
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <div className="space-y-2">
                  {["All", "Scholarship", "Internship", "Govt Job", "Training Program"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters({...filters, category: cat})}
                      className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition text-left ${
                        filters.category === cat 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Min. Match: <span className="text-blue-600">{filters.minMatch}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  value={filters.minMatch}
                  onChange={(e) => setFilters({...filters, minMatch: parseInt(e.target.value)})}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>0%</span>
                  <span>90%</span>
                </div>
              </div>

              <button
                onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: ''})}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition border border-blue-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="max-w-4xl space-y-6">
            {filteredSchemes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No eligible schemes found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to find more matching schemes
                </p>
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Back to Form
                </button>
              </div>
            ) : (
              filteredSchemes.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchColor(item.matchPercentage)}`}>
                            {item.matchPercentage}% Match
                          </span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium">
                            {item.scheme.category}
                          </span>
                          {item.scheme.featured && (
                            <span className="px-3 py-1 bg-yellow-100 rounded-full text-yellow-800 text-sm font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.scheme.name}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {item.scheme.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {(item.scheme.benefits || []).slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Why You're Eligible</h4>
                        <ul className="space-y-2">
                          {(item.aiExplanation ? [item.aiExplanation] : []).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 text-sm">{detail}</span>
                            </li>
                          ))}
                          <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600 text-sm">{item.matchPercentage}% match based on your profile</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedScheme(item.scheme)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                      {item.scheme.applicationLink && (
                        <a
                          href={item.scheme.applicationLink}
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
              ))
            )}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Save Your Profile for Future Use
            </h3>
            <p className="text-gray-600 mb-6">
              Create an account to save your profile, track applications, and get personalized scheme recommendations
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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