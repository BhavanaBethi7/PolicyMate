import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleCheck = async () => {
    // Validate required fields
    if (!tempProfile.educationLevel || !tempProfile.category || !tempProfile.state) {
      setError('Please fill in Education Level, Category, and State');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/eligibility/check-temp', tempProfile);

      if (response.data.success) {
        setSchemes(response.data.schemes);
        setShowResults(true);
      } else {
        setError('Failed to check eligibility');
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {!showResults ? (
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quick Eligibility Check
            </h1>
            <p className="text-gray-600 text-lg">
              Check your eligibility for schemes without creating an account
            </p>
          </div>

          {/* Form */}
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
              
              {/* Education Level */}
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

              {/* Field of Study */}
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

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={tempProfile.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra, Karnataka"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                />
              </div>

              {/* Category */}
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

              {/* Annual Income */}
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

              {/* Age */}
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

              {/* Gender */}
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

              {/* Location Type */}
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

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
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

          {/* Login Prompt */}
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
      ) : (
        /* Results Section */
        <div className="max-w-6xl mx-auto">
          
          {/* Results Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Eligibility Results
            </h1>
            <p className="text-gray-600 text-lg">
              Found {schemes.length} schemes matching your profile
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setShowResults(false)}
            className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back to Form
          </button>

          {/* Schemes Results */}
          <div className="space-y-6">
            
            {schemes.length === 0 ? (
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
                  Try adjusting your criteria or check with different information
                </p>
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              schemes.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200">
                  
                  {/* Scheme Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
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

                      {/* Eligibility Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Why You're Eligible</h4>
                        <ul className="space-y-2">
                          {item.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 text-sm">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
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

          {/* Create Account CTA */}
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
      )}

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