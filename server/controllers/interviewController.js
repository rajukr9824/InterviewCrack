// server/controllers/interviewController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty required" });
    }

    // Use the model identifier verified in your listModels output
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as a Lead Technical Interviewer. 
      Generate exactly 10 interview questions for a ${topic} position at a ${difficulty} level.
      Provide a detailed solution for each.
      
      Output MUST be a raw JSON array of objects with "question" and "solution" keys. 
      Do not include markdown backticks like \`\`\`json.
      
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // FAIL-SAFE JSON EXTRACTION
    let questions;
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parsing Error. Raw Text:", text);
      return res.status(500).json({ message: "AI returned invalid format. Please try again." });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error("DETAILED ERROR:", error); // Check your terminal for this!
    res.status(500).json({ message: error.message }); // Send real error to frontend
}
};

module.exports = { generateQuestions };