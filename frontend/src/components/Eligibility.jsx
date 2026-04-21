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
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Finding eligible schemes for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchEligibleSchemes}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Eligible Schemes</h1>
            <p className="text-gray-600 text-sm mt-1">{filteredSchemes.length} schemes found</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
              {/* Search */}
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

              {/* State Filter */}
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

              {/* Category Filter */}
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

              {/* Match Percentage Slider */}
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

              {/* Financial Aid Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <input 
                  type="checkbox"
                  checked={filters.hasFinancialAid}
                  onChange={(e) => setFilters({...filters, hasFinancialAid: e.target.checked})}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Financial Aid Only</span>
              </label>

              {/* Reset Button */}
              <button
                onClick={() => setFilters({category: 'All', state: 'All', minMatch: 0, searchQuery: '', hasFinancialAid: false})}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition border border-blue-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">

        {/* Schemes Grid */}
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
              Try updating your profile to find more matching schemes
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        ) : (
          filteredSchemes.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200">
              {/* Scheme Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-800 text-sm font-medium">
                        AI Matched
                      </span>
                      <span className="px-3 py-1 bg-green-100 rounded-full text-green-800 text-sm font-medium">
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

              {/* Scheme Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {item.scheme.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Explanation */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">AI Analysis</h4>
                    <div className="text-gray-600 text-sm whitespace-pre-line">
                      {item.aiExplanation ? (
                        <div>
                          <p>{item.aiExplanation}</p>
                        </div>
                      ) : (
                        <p>AI analysis not available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSelectedScheme(item.scheme)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  {item.scheme.applicationLink && (
                    <a
                      href={item.scheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-center"
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
