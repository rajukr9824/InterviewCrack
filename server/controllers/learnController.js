// server/controllers/learnController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTopicExplanation = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as a senior technical interviewer.
      Explain the topic "${topic}" for interview preparation.

      Rules:
      - Use simple language
      - Use bullet points
      - Focus on commonly asked interview concepts
      - Avoid unnecessary theory
      - Keep the explanation concise and readable

      Output MUST be plain text.
      Do not include markdown or backticks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.status(200).json({ explanation });
  } catch (error) {
    console.error("LEARN TOPIC ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateTopicExplanation };
