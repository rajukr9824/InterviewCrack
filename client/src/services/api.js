// client/src/services/api.js
import api from "../api/axios";

export const generateInterviewQuestions = async (topic, difficulty) => {
  const res = await api.post("/api/interview/generate", {
    topic,
    difficulty,
  });
  return res.data.questions;
};

export const generateTopicExplanation = async (topic) => {
  const res = await api.post("/api/learn/explain", { topic });
  return res.data.explanation;
};

export const generateQuiz = async (topic) => {
  const res = await api.post("/api/quiz/generate", { topic });
  return res.data.quiz;
};

