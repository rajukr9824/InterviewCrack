const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCodingProblems = async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!difficulty) {
      return res.status(400).json({ message: "Difficulty is required" });
    }

    const prompt = `
Act as a senior FAANG interviewer.

Generate exactly 3 top interview coding problems from:
${topicPart}

Rules:
- Problem 1: Easy
- Problem 2: Medium
- Problem 3: Hard
- Problems must be commonly asked in interviews (LeetCode-style)

Each problem must include:
- title
- difficulty (Easy / Medium / Hard)
- description
- example input/output
- constraints
- expected approach (no code)

Output MUST be a raw JSON array.
Format:
[
  {
    "title": "",
    "difficulty": "",
    "description": "",
    "example": "",
    "constraints": "",
    "approach": "",
    "leetcodeLink": ""
  }
]

Do NOT include markdown or extra text.
`;


    /* ---------- OPENAI FIRST ---------- */
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const problems = extractJSON(response.choices[0].message.content);

      return res.status(200).json({
        problems,
        source: "openai",
      });
    } catch (openAiError) {
      console.error("OpenAI failed, switching to Gemini...");
    }

    /* ---------- GEMINI FALLBACK ---------- */
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;

      const problems = extractJSON(response.text());

      return res.status(200).json({
        problems,
        source: "gemini",
      });
    } catch (geminiError) {
      console.error("Gemini failed:", geminiError);
    }

    res.status(500).json({
      message: "Unable to generate coding problems",
      source: "fallback",
    });
  } catch (error) {
    console.error("CODING CONTROLLER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------- JSON Extractor ---------- */
const extractJSON = (text) => {
  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;
    return JSON.parse(text.substring(start, end));
  } catch {
    throw new Error("Invalid AI response format");
  }
};

module.exports = { generateCodingProblems };
