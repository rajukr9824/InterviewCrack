// client/src/services/api.js
import axios from "axios";
import { getToken } from "../utils/Auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically adds JWT to every request if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateInterviewQuestions = async (topic, difficulty) => {
  const res = await api.post("/interview/generate", { topic, difficulty });
  return res.data.questions;
};
export const generateTopicExplanation = async (topic) => {
  const res = await api.post("/learn/explain", { topic });
  return res.data.explanation;
};
export const generateQuiz = async (topic) => {
  const res = await api.post("/quiz/generate", { topic });
  return res.data.quiz;
};