const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  indexRepository,
  searchRepository,
  chatRepository,
  startInterview,
  submitAnswer,
  endInterview,
  getSession,
} = require("../controllers/repositoryController");

const router = express.Router();

// Repository indexing and searching
router.post("/index", protect, indexRepository);
router.post("/search", protect, searchRepository);

// Repository Q&A (RAG chat)
router.post("/chat", protect, chatRepository);

// Repository Interview system
router.post("/interview/start", protect, startInterview);
router.post("/interview/answer", protect, submitAnswer);
router.post("/interview/end", protect, endInterview);
router.get("/interview/session/:session_id", protect, getSession);

module.exports = router;
