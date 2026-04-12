const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const {
  getProfile,
  saveProfile,
  deleteProfile
} = require("../controllers/profileController");

// All routes require authentication
router.get("/me", verifyToken, getProfile);
router.post("/save", verifyToken, saveProfile);
router.delete("/", verifyToken, deleteProfile);

module.exports = router;


module.exports = router;