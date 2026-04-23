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

export default function Eligibility() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "All",
    state: "All",
    minMatch: 0,
    searchQuery: "",
    hasFinancialAid: false,
  });

  useEffect(() => {
    fetchEligibleSchemes();
  }, []);

  const fetchEligibleSchemes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/ai/ai-enhanced', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSchemes(response.data.schemes);
      } else {
        setError('Failed to fetch eligible schemes');
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
      setError('Server error. Please try again.');
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
      const matchesMoney = !filters.hasFinancialAid || (scheme.amount && scheme.amount.toLowerCase() !== "n/a");

      return matchesState && matchesCategory && matchesSearch && matchesMatch && matchesMoney;
    });
  }, [schemes, filters]);

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Scholarship': 'GraduationCap',
      'Internship': 'Briefcase',
      'Govt Job': 'Building',
      'Training Program': 'BookOpen'
    };
    return icons[category] || 'FileText';
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Schemes</h2>
            <p className="text-gray-600">Analyzing your profile for the best matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-6">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchEligibleSchemes}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Try Again
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
            <h1 className="text-3xl font-black text-gray-900">Your Eligible Schemes</h1>
            <p className="text-gray-600 text-sm mt-1">{filteredSchemes.length} schemes found</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Container */}
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
              {/* Enhanced Search */}
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

              {/* Enhanced State Filter */}
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

              {/* Enhanced Category Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Type</label>
                <div className="space-y-3">
                  {["All", "Scholarship", "Internship", "Govt Job", "Training Program"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters({...filters, category: cat})}
                      className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left flex items-center gap-3 ${
                        filters.category === cat 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
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

              {/* Enhanced Match Percentage Slider */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Min. Match: <span className="text-blue-600 font-bold">{filters.minMatch}%</span>
                </label>
                <div className="space-y-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={filters.minMatch}
                    onChange={(e) => setFilters({...filters, minMatch: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>0%</span>
                    <span>45%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Financial Aid Checkbox */}
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
                <input 
                  type="checkbox"
                  checked={filters.hasFinancialAid}
                  onChange={(e) => setFilters({...filters, hasFinancialAid: e.target.checked})}
                  className="w-5 h-5 cursor-pointer text-green-600 rounded border-2 border-green-400 focus:ring-2 focus:ring-green-400"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-700">Financial Aid Only</span>
                  <p className="text-xs text-gray-500 mt-1">Show schemes with financial benefits</p>
                </div>
              </label>

              {/* Enhanced Reset Button */}
              <button
                onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: '', hasFinancialAid: false})}
                className="w-full px-4 py-3 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border-2 border-blue-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">

        {/* Enhanced Schemes Grid */}
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
              Try updating your profile or adjusting filters to find more matching schemes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Update Profile
              </button>
              <button
                onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: '', hasFinancialAid: false})}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          filteredSchemes.map((item, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Enhanced Scheme Header */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-md ${getMatchColor(item.matchPercentage)}`}>
                        🎯 {item.matchPercentage}% Match
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-800 text-sm font-bold">
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

              {/* Enhanced Scheme Details */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Enhanced Benefits */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                      <span className="text-green-500 text-xl">💰</span>
                      Benefits
                    </h4>
                    <ul className="space-y-3">
                      {item.scheme.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enhanced AI Explanation */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                      <span className="text-blue-500 text-xl">🤖</span>
                      AI Analysis
                    </h4>
                    <div className="text-gray-700 whitespace-pre-line bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                      {item.aiExplanation ? (
                        <p className="font-medium">{item.aiExplanation}</p>
                      ) : (
                        <p className="text-gray-500">AI analysis not available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedScheme(item.scheme)}
                    className="group flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>📋</span>
                      <span>View Details</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
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
                  {selectedScheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
