const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Act as a technical interviewer.

Generate exactly 10 multiple-choice questions for ${topic}.
Each question must have:
- question
- 4 options
- correct answer index (0-based)

Output MUST be raw JSON array.
Format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correct": 0
  }
]

Do NOT include markdown or extra text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Safe JSON extraction
    let quiz;
    try {
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]") + 1;
      quiz = JSON.parse(text.substring(start, end));
    } catch {
      return res
        .status(500)
        .json({ message: "Invalid AI response format" });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuiz };
