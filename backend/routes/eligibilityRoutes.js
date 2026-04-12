const { getEligibleSchemes, checkTempEligibility, getSchemeDetails, getAllSchemes } = require('../controllers/eligibilityController');
const { verifyToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// Protected routes (require authentication)
router.get('/my-schemes', verifyToken, getEligibleSchemes);
router.get('/scheme/:schemeId', verifyToken, getSchemeDetails);

// Public routes (no authentication required)
router.post('/check-temp', checkTempEligibility);
router.get('/all', getAllSchemes);

module.exports = router;
