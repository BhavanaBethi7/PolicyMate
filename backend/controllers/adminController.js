const User = require('../models/UserModel');
const Scheme = require('../models/Scheme');
const Profile = require('../models/Profile');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalSchemes = await Scheme.countDocuments({ active: true });
    const totalProfiles = await Profile.countDocuments();
    
    // Get recent registrations (last 7 days, excluding admins)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      role: { $ne: 'admin' }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSchemes,
        totalProfiles,
        recentRegistrations,
        activeApplications: totalProfiles // Using profiles as proxy for applications
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// Get all users (excluding admin users)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 for performance

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Get all schemes
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      schemes
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete user's profile first
    await Profile.deleteOne({ userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// Delete scheme
const deleteScheme = async (req, res) => {
  try {
    const { schemeId } = req.params;
    
    await Scheme.findByIdAndDelete(schemeId);

    res.json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scheme:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scheme'
    });
  }
};

// Update scheme status (active/inactive)
const updateSchemeStatus = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const { active } = req.body;
    
    await Scheme.findByIdAndUpdate(schemeId, { active });

    res.json({
      success: true,
      message: 'Scheme status updated successfully'
    });
  } catch (error) {
    console.error('Error updating scheme status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating scheme status'
    });
  }
};

// Get user profile with matched schemes
const getUserWithSchemes = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user details
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user profile
    const profile = await Profile.findOne({ userId });
    
    // Get all schemes
    const allSchemes = await Scheme.find({ active: true });
    
    // Match schemes based on user profile
    let matchedSchemes = [];
    
    if (profile) {
      matchedSchemes = allSchemes.filter(scheme => {
        // Education matching
        const educationMatch = !scheme.eligibility.education.length || 
          scheme.eligibility.education.includes(profile.educationLevel);
        
        // Category matching
        const categoryMatch = !scheme.eligibility.categories.length || 
          scheme.eligibility.categories.includes(profile.category);
        
        // State matching
        const stateMatch = !scheme.eligibility.states.length || 
          scheme.eligibility.states.includes('All India') || 
          scheme.eligibility.states.includes(profile.state);
        
        // Income matching
        const incomeMatch = !scheme.eligibility.income || 
          scheme.eligibility.income === 'Any' || 
          profile.income === scheme.eligibility.income;
        
        return educationMatch && categoryMatch && stateMatch && incomeMatch;
      });
    }

    res.json({
      success: true,
      user: user,
      profile: profile,
      matchedSchemes: matchedSchemes,
      totalSchemes: allSchemes.length
    });
  } catch (error) {
    console.error('Error fetching user with schemes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

// Create new scheme
const createScheme = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      eligibility,
      benefits,
      applicationProcess,
      officialLink,
      applicationLink,
      duration,
      amount,
      lastDate,
      featured
    } = req.body;

    // Validation
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required'
      });
    }

    // Create new scheme
    const newScheme = new Scheme({
      name,
      description,
      category,
      eligibility: eligibility || {},
      benefits: benefits || [],
      applicationProcess: applicationProcess || [],
      officialLink: officialLink || '',
      applicationLink: applicationLink || '',
      duration: duration || '',
      amount: amount || '',
      lastDate: lastDate || '',
      featured: featured || false,
      active: true
    });

    await newScheme.save();

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      scheme: newScheme
    });
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating scheme'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllSchemes,
  deleteUser,
  deleteScheme,
  updateSchemeStatus,
  getUserWithSchemes,
  createScheme
};
