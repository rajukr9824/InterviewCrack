const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  updateDailyCoding,
  updateInterviewSession,
  updateQuizSession,
} = require("../controllers/userController");

const router = express.Router();

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

// Daily Coding Streak
router.post("/daily-coding", protect, updateDailyCoding);

// Interview Practice Session
router.post("/interview-session", protect, updateInterviewSession);

// Quiz Practice Session
router.post("/quiz-session", protect, updateQuizSession);

module.exports = router;
