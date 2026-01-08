
import api from "../api/axios";
import { getToken } from "../utils/Auth";

// Attach token (if you are not already doing this globally)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updateDailyCoding = () =>
  api.post("/api/user/daily-coding");

export const updateInterviewSession = () =>
  api.post("/api/user/interview-session");

export const updateQuizSession = () =>
  api.post("/api/user/quiz-session");
