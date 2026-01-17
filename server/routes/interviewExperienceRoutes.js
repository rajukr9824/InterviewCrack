const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");

const {
  addInterviewExperience,
  getInterviewExperiences,
  updateInterviewExperience,
  deleteInterviewExperience,
  getMyInterviewExperiences,
} = require("../controllers/interviewExperienceController");

// POST → add experience (protected)
router.post("/", protect, addInterviewExperience);

// GET → view / filter experiences (public)
router.get("/", getInterviewExperiences);
router.get("/my", protect, getMyInterviewExperiences);
router.put("/:id", protect, updateInterviewExperience);
router.delete("/:id", protect, deleteInterviewExperience)

module.exports = router;
