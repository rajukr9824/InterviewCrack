// client/src/services/api.js
import api from "../api/axios";
import { getToken } from "../utils/Auth";



// Automatically adds JWT to every request if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
export const generateCodingProblems = async (difficulty) => {
  const res = await api.post("/api/coding/problem", { difficulty });
  return res.data;
};
