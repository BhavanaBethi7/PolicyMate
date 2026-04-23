const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllSchemes,
  deleteUser,
  deleteScheme,
  updateSchemeStatus,
  getUserWithSchemes,
  createScheme
} = require('../controllers/adminController');

// All routes require authentication
router.get('/stats', verifyToken, getDashboardStats);
router.get('/users', verifyToken, getAllUsers);
router.get('/schemes', verifyToken, getAllSchemes);
router.post('/schemes', verifyToken, createScheme);
router.get('/users/:userId/profile', verifyToken, getUserWithSchemes);
router.delete('/users/:userId', verifyToken, deleteUser);
router.delete('/schemes/:schemeId', verifyToken, deleteScheme);
router.put('/schemes/:schemeId/status', verifyToken, updateSchemeStatus);

module.exports = router;
