const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

/* ---------- OpenAI Setup ---------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------- Gemini Setup ---------- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTopicExplanation = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `
Act as a senior technical interviewer.
Explain the topic "${topic}" for interview preparation.

Rules:
- Use simple language
- Use bullet points
- Focus on commonly asked interview concepts
- Avoid unnecessary theory
- Keep the explanation concise and readable
- Output MUST be plain text
`;

    /* ---------- TRY OPENAI FIRST ---------- */
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return res.status(200).json({
        explanation: response.choices[0].message.content,
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

      return res.status(200).json({
        explanation: response.text(),
        source: "gemini",
      });
    } catch (geminiError) {
      console.error("Gemini also failed:");
    }

    /* ---------- FINAL FALLBACK ---------- */
    res.status(500).json({
      explanation:
        "Unable to generate explanation at the moment. Please try again later.",
      source: "fallback",
    });
  } catch (error) {
    console.error("LEARN TOPIC ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateTopicExplanation };
