const { smartSchemeSearch, getAIEnhancedEligibility, parseTextToProfile, getSchemeDetails, getAllSchemes } = require('../controllers/eligibilityController');
const { verifyToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// AI-powered routes
router.get('/ai-enhanced', verifyToken, getAIEnhancedEligibility);
router.post('/smart-search', smartSchemeSearch);
router.post('/parse-text', parseTextToProfile);

// Basic routes (kept for compatibility)
router.get('/scheme/:schemeId', verifyToken, getSchemeDetails);
router.get('/all', getAllSchemes);

module.exports = router;