import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchemes: 0,
    activeApplications: 0,
    recentRegistrations: 0
  });
  const [users, setUsers] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userSchemes, setUserSchemes] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [addingScheme, setAddingScheme] = useState(false);
  const [newScheme, setNewScheme] = useState({
    name: '',
    description: '',
    category: 'Scholarship',
    benefits: '',
    applicationProcess: '',
    officialLink: '',
    applicationLink: '',
    duration: '',
    amount: '',
    lastDate: '',
    featured: false
  });
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showSchemeModal, setShowSchemeModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Fetch stats
      const statsResponse = await axios.get('/api/admin/stats', { headers });
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch users
      const usersResponse = await axios.get('/api/admin/users', { headers });
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);
      }

      // Fetch schemes
      const schemesResponse = await axios.get('/api/admin/schemes', { headers });
      if (schemesResponse.data.success) {
        setSchemes(schemesResponse.data.schemes);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/schemes/${schemeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting scheme:', error);
        alert('Error deleting scheme');
      }
    }
  };

  const handleToggleSchemeStatus = async (schemeId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/schemes/${schemeId}/status`, 
        { active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating scheme status:', error);
      alert('Error updating scheme status');
    }
  };

  const handleViewUserProfile = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSelectedUser(response.data.user);
        setUserProfile(response.data.profile);
        setUserSchemes(response.data.matchedSchemes);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details');
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserProfile(null);
    setUserSchemes([]);
  };

  const handleAddSchemeClick = () => {
    setShowAddSchemeModal(true);
  };

  const closeAddSchemeModal = () => {
    setShowAddSchemeModal(false);
    setNewScheme({
      name: '',
      description: '',
      category: 'Scholarship',
      benefits: '',
      applicationProcess: '',
      officialLink: '',
      applicationLink: '',
      duration: '',
      amount: '',
      lastDate: '',
      featured: false
    });
  };

  const handleSchemeInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewScheme(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitScheme = async (e) => {
    e.preventDefault();
    
    if (!newScheme.name || !newScheme.description) {
      alert('Please fill in all required fields');
      return;
    }

    setAddingScheme(true);
    try {
      const token = localStorage.getItem('token');
      
      // Parse benefits and applicationProcess from textarea (comma-separated)
      const benefitsArray = newScheme.benefits
        .split(',')
        .map(b => b.trim())
        .filter(b => b);
      
      const applicationProcessArray = newScheme.applicationProcess
        .split('\n')
        .map((step, index) => ({
          step: index + 1,
          description: step.trim()
        }))
        .filter(s => s.description);

      const schemeData = {
        name: newScheme.name,
        description: newScheme.description,
        category: newScheme.category,
        benefits: benefitsArray,
        applicationProcess: applicationProcessArray,
        officialLink: newScheme.officialLink,
        applicationLink: newScheme.applicationLink,
        duration: newScheme.duration,
        amount: newScheme.amount,
        lastDate: newScheme.lastDate,
        featured: newScheme.featured
      };

      const response = await axios.post('/api/admin/schemes', schemeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Scheme added successfully');
        closeAddSchemeModal();
        fetchDashboardData();
      } else {
        alert('Error adding scheme');
      }
    } catch (error) {
      console.error('Error adding scheme:', error);
      alert('Error adding scheme: ' + (error.response?.data?.message || error.message));
    } finally {
      setAddingScheme(false);
    }
  };

  const handleViewScheme = (scheme) => {
    setSelectedScheme(scheme);
    setShowSchemeModal(true);
  };

  const closeSchemeModal = () => {
    setShowSchemeModal(false);
    setSelectedScheme(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">👥</span>
          </div>
          <span className="text-4xl font-black text-gray-900">{stats.totalUsers}</span>
        </div>
        <p className="text-gray-700 font-bold text-lg">Total Users</p>
        <p className="text-gray-500 text-sm mt-2">Registered members</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <span className="text-4xl font-black text-gray-900">{stats.totalSchemes}</span>
        </div>
        <p className="text-gray-700 font-bold text-lg">Total Schemes</p>
        <p className="text-gray-500 text-sm mt-2">Available schemes</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">📝</span>
          </div>
          <span className="text-4xl font-black text-gray-900">{stats.activeApplications}</span>
        </div>
        <p className="text-gray-700 font-bold text-lg">Active Applications</p>
        <p className="text-gray-500 text-sm mt-2">Pending reviews</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">📈</span>
          </div>
          <span className="text-4xl font-black text-gray-900">{stats.recentRegistrations}</span>
        </div>
        <p className="text-gray-700 font-bold text-lg">New Registrations</p>
        <p className="text-gray-500 text-sm mt-2">This month</p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
        </div>
      </div>
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-bold rounded-full">
                      {user.isGoogleUser ? 'Google User' : 'Email User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewUserProfile(user._id)}
                      className="text-blue-600 hover:text-blue-800 font-bold mr-4 transition-colors duration-200"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 font-bold transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📭</span>
                      </div>
                      <p className="text-gray-500 font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSchemes = () => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Scheme Management</h3>
          </div>
          <button 
            onClick={handleAddSchemeClick}
            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>➕</span>
              <span>Add New Scheme</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
          </button>
        </div>
      </div>
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Scheme Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {schemes.map((scheme) => (
                <tr key={scheme._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{scheme.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                      </div>
                      <span className="font-medium text-gray-900">{scheme.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold rounded-full">
                      {scheme.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleSchemeStatus(scheme._id, scheme.active)}
                      className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                        scheme.active 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200' 
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200'
                      }`}
                    >
                      {scheme.active ? '✓ Active' : '✗ Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewScheme(scheme)}
                      className="text-blue-600 hover:text-blue-800 font-bold mr-4 transition-colors duration-200"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteScheme(scheme._id)}
                      className="text-red-600 hover:text-red-800 font-bold transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {schemes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📭</span>
                      </div>
                      <p className="text-gray-500 font-medium">No schemes found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">🎛️</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Manage users and schemes</p>
              </div>
            </div>
            <Link to="/login" className="group bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <span>🚪</span>
                <span>Logout</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📊</span>
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">👥</span>
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === 'schemes'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">🎯</span>
                <span>Schemes</span>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'schemes' && renderSchemes()}
      </div>

      {/* User Profile Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">User Profile & Matched Schemes</h3>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingUserDetails ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading user details...</p>
              </div>
            ) : (
              <div className="p-6">
                {/* User Information */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">User Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedUser?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedUser?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium">{selectedUser?.isGoogleUser ? 'Google User' : 'Email User'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-medium text-xs">{selectedUser?._id}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                {userProfile ? (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Profile Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Education Level</p>
                        <p className="font-medium">{userProfile?.educationLevel || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Course</p>
                        <p className="font-medium">{userProfile?.course || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="font-medium">{userProfile?.state || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Income Range</p>
                        <p className="font-medium">{userProfile?.income || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{userProfile?.category || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Profile Details</h4>
                    <p className="text-gray-500">User has not completed their profile yet.</p>
                  </div>
                )}

                {/* Matched Schemes */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Matched Schemes ({userSchemes.length} schemes)
                  </h4>
                  {userSchemes.length > 0 ? (
                    <div className="space-y-3">
                      {userSchemes.map((scheme) => (
                        <div key={scheme._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">{scheme.name}</h5>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {scheme.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {scheme.benefits.slice(0, 2).map((benefit, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {scheme.amount ? `Amount: ${scheme.amount}` : ''}
                            </span>
                            <a
                              href={scheme.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      {userProfile ? 'No schemes match this user\'s profile criteria.' : 'Complete profile to see matched schemes.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Scheme Details Modal */}
      {showSchemeModal && selectedScheme && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Scheme Details</h3>
              <button
                onClick={closeSchemeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Scheme Header */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedScheme.name}</h2>
                    <p className="text-gray-600 mt-2">{selectedScheme.description}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {selectedScheme.category}
                  </span>
                </div>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedScheme.active ? '✓ Active' : '✗ Inactive'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedScheme.duration || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Amount</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedScheme.amount || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Last Date</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedScheme.lastDate ? new Date(selectedScheme.lastDate).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              {selectedScheme.benefits && selectedScheme.benefits.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScheme.benefits.map((benefit, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Process */}
              {selectedScheme.applicationProcess && selectedScheme.applicationProcess.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Application Process</h4>
                  <div className="space-y-2">
                    {selectedScheme.applicationProcess.map((process, index) => (
                      <div key={index} className="flex items-start">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3">
                          {process.step}
                        </span>
                        <p className="text-gray-700 pt-0.5">{process.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Important Links</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedScheme.officialLink && (
                    <a
                      href={selectedScheme.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 text-sm"
                    >
                      Official Website
                    </a>
                  )}
                  {selectedScheme.applicationLink && (
                    <a
                      href={selectedScheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-center hover:bg-green-700 text-sm"
                    >
                      Apply Now
                    </a>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeSchemeModal}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Scheme Modal */}
      {showAddSchemeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add New Scheme</h3>
              <button
                onClick={closeAddSchemeModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={addingScheme}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitScheme} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheme Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newScheme.name}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter scheme name"
                  disabled={addingScheme}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={newScheme.description}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter scheme description"
                  rows="3"
                  disabled={addingScheme}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={newScheme.category}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={addingScheme}
                >
                  <option value="Scholarship">Scholarship</option>
                  <option value="Internship">Internship</option>
                  <option value="Govt Job">Govt Job</option>
                  <option value="Training Program">Training Program</option>
                </select>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits (comma-separated)
                </label>
                <textarea
                  name="benefits"
                  value={newScheme.benefits}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Monthly Stipend, Free Books, Internship Opportunity"
                  rows="2"
                  disabled={addingScheme}
                />
              </div>

              {/* Application Process */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Process (one step per line)
                </label>
                <textarea
                  name="applicationProcess"
                  value={newScheme.applicationProcess}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Step 1: Register on portal&#10;Step 2: Upload documents&#10;Step 3: Submit form"
                  rows="3"
                  disabled={addingScheme}
                />
              </div>

              {/* Official Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Official Link
                </label>
                <input
                  type="url"
                  name="officialLink"
                  value={newScheme.officialLink}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                  disabled={addingScheme}
                />
              </div>

              {/* Application Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Link
                </label>
                <input
                  type="url"
                  name="applicationLink"
                  value={newScheme.applicationLink}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/apply"
                  disabled={addingScheme}
                />
              </div>

              {/* Duration and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={newScheme.duration}
                    onChange={handleSchemeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1 year"
                    disabled={addingScheme}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={newScheme.amount}
                    onChange={handleSchemeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ₹50,000"
                    disabled={addingScheme}
                  />
                </div>
              </div>

              {/* Last Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Application Date
                </label>
                <input
                  type="date"
                  name="lastDate"
                  value={newScheme.lastDate}
                  onChange={handleSchemeInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={addingScheme}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={newScheme.featured}
                  onChange={handleSchemeInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={addingScheme}
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Mark as Featured
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={addingScheme}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {addingScheme ? 'Adding...' : 'Add Scheme'}
                </button>
                <button
                  type="button"
                  onClick={closeAddSchemeModal}
                  disabled={addingScheme}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
