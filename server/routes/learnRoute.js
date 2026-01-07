const express = require("express");
const {
  generateTopicExplanation,
} = require("../controllers/learnController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate explanation for selected topic (Gemini AI)
router.post("/explain", protect, generateTopicExplanation);

module.exports = router;
