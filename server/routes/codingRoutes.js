const express = require("express");
const { generateCodingProblems } = require("../controllers/codingController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/problem", protect, generateCodingProblems);

module.exports = router;
