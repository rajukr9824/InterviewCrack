const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

/* ---------- OpenAI Setup ---------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------- Gemini Setup ---------- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

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

    /* ---------- TRY OPENAI FIRST ---------- */
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const text = response.choices[0].message.content;
      const quiz = extractJSON(text);

      return res.status(200).json({
        quiz,
        source: "openai",
      });
    } catch (openAiError) {
      console.error("OpenAI failed, switching to Gemini...");
    }

    /* ---------- FALLBACK TO GEMINI ---------- */
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const quiz = extractJSON(text);

      return res.status(200).json({
        quiz,
        source: "gemini",
      });
    } catch (geminiError) {
      console.error("Gemini failed");
    }

    /* ---------- FINAL FALLBACK ---------- */
    res.status(500).json({
      message: "Unable to generate quiz at the moment",
      source: "fallback",
    });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------- Safe JSON Extractor ---------- */
const extractJSON = (text) => {
  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) {
      throw new Error("JSON not found");
    }

    return JSON.parse(text.substring(start, end));
  } catch (error) {
    throw new Error("Invalid AI response format");
  }
};

module.exports = { generateQuiz };
