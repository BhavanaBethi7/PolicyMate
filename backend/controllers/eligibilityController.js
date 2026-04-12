const Scheme = require('../models/Scheme');

// Income level mapping
const incomeMapping = {
  '<1L': { min: 0, max: 100000 },
  '1-3L': { min: 100000, max: 300000 },
  '3-5L': { min: 300000, max: 500000 },
  '5-8L': { min: 500000, max: 800000 },
  '8L+': { min: 800000, max: Infinity }
};

// Parse income string to number
const parseIncome = (incomeStr) => {
  if (!incomeStr) return 0;
  const num = parseInt(incomeStr.replace(/[^\d]/g, ''));
  return isNaN(num) ? 0 : num;
};

// Calculate match score for a single scheme
const calculateSchemeMatch = (profile, scheme) => {
  let score = 0;
  let maxScore = 0;
  const details = [];

  // Education match (weight: 25%)
  maxScore += 25;
  if (scheme.eligibility.education.includes(profile.educationLevel)) {
    score += 25;
    details.push('Education level matches');
  } else {
    details.push('Education level does not match');
  }

  // Category match (weight: 20%)
  maxScore += 20;
  if (scheme.eligibility.categories.includes(profile.category)) {
    score += 20;
    details.push('Category matches');
  } else {
    details.push('Category does not match');
  }

  // Income match (weight: 20%)
  maxScore += 20;
  if (scheme.eligibility.income === 'Any') {
    score += 20;
    details.push('No income restriction');
  } else {
    const userIncome = parseIncome(profile.income);
    const incomeRange = incomeMapping[scheme.eligibility.income];
    if (incomeRange && userIncome >= incomeRange.min && userIncome <= incomeRange.max) {
      score += 20;
      details.push('Income within eligible range');
    } else {
      details.push('Income outside eligible range');
    }
  }

  // State match (weight: 15%)
  maxScore += 15;
  if (scheme.eligibility.states.includes('All India') || 
      scheme.eligibility.states.includes(profile.state)) {
    score += 15;
    details.push('State eligibility satisfied');
  } else {
    details.push('Not eligible in your state');
  }

  // Age match (weight: 10%)
  maxScore += 10;
  const userAge = parseInt(profile.age);
  if (!scheme.eligibility.age || 
      (userAge >= scheme.eligibility.age.min && userAge <= scheme.eligibility.age.max)) {
    score += 10;
    details.push('Age within eligible range');
  } else {
    details.push('Age outside eligible range');
  }

  // Gender match (weight: 5%)
  maxScore += 5;
  if (scheme.eligibility.gender === 'Any' || 
      scheme.eligibility.gender === profile.gender) {
    score += 5;
    details.push('Gender requirement satisfied');
  } else {
    details.push('Gender does not match');
  }

  // Location type match (weight: 3%)
  maxScore += 3;
  if (scheme.eligibility.locationType === 'Any' || 
      scheme.eligibility.locationType === profile.locationType) {
    score += 3;
    details.push('Location type matches');
  } else {
    details.push('Location type does not match');
  }

  // First graduate match (weight: 2%)
  maxScore += 2;
  if (scheme.eligibility.firstGraduate === 'Any' || 
      scheme.eligibility.firstGraduate === profile.firstGraduate) {
    score += 2;
    details.push('First graduate requirement satisfied');
  } else {
    details.push('First graduate requirement not met');
  }

  const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    scheme,
    matchPercentage,
    score,
    maxScore,
    details,
    isEligible: matchPercentage >= 50 // 50% threshold for eligibility
  };
};

// Get eligible schemes for user
const getEligibleSchemes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user profile (you'll need to implement this)
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get all active schemes
    const schemes = await Scheme.find({ active: true });
    
    // Calculate matches for all schemes
    const matches = schemes.map(scheme => calculateSchemeMatch(profile, scheme));
    
    // Filter only eligible schemes and sort by match percentage
    const eligibleSchemes = matches
      .filter(match => match.isEligible)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      schemes: eligibleSchemes,
      totalSchemes: schemes.length,
      eligibleCount: eligibleSchemes.length
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking eligibility'
    });
  }
};

// Check eligibility for temporary profile (no authentication required)
const checkTempEligibility = async (req, res) => {
  try {
    const tempProfile = req.body;
    
    if (!tempProfile.educationLevel || !tempProfile.category || !tempProfile.state) {
      return res.status(400).json({
        success: false,
        message: 'Education, category, and state are required'
      });
    }

    // Get all active schemes
    const schemes = await Scheme.find({ active: true });
    
    // Calculate matches for all schemes
    const matches = schemes.map(scheme => calculateSchemeMatch(tempProfile, scheme));
    
    // Filter only eligible schemes and sort by match percentage
    const eligibleSchemes = matches
      .filter(match => match.isEligible)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      schemes: eligibleSchemes,
      totalSchemes: schemes.length,
      eligibleCount: eligibleSchemes.length
    });
  } catch (error) {
    console.error('Temporary eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking eligibility'
    });
  }
};

// Get scheme details
const getSchemeDetails = async (req, res) => {
  try {
    const { schemeId } = req.params;
    
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      scheme
    });
  } catch (error) {
    console.error('Get scheme details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scheme details'
    });
  }
};

// Get all schemes (for browsing)
const getAllSchemes = async (req, res) => {
  try {
    const { category, state, education } = req.query;
    
    let filter = { active: true };
    
    if (category) filter.category = category;
    if (state) filter['eligibility.states'] = { $in: ['All India', state] };
    if (education) filter['eligibility.education'] = education;

    const schemes = await Scheme.find(filter)
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      schemes,
      total: schemes.length
    });
  } catch (error) {
    console.error('Get all schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schemes'
    });
  }
};

module.exports = {
  getEligibleSchemes,
  checkTempEligibility,
  getSchemeDetails,
  getAllSchemes
};
