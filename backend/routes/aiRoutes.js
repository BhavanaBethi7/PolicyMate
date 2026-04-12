const { parseProfileText, explainSchemeMatch, askAboutSchemes } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// Public route for profile parsing (no auth required)
router.post('/parse-profile', parseProfileText);

// Protected routes (require authentication)
router.post('/explain-match', verifyToken, explainSchemeMatch);
router.post('/ask', verifyToken, askAboutSchemes);

module.exports = router;
