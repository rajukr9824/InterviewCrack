import axios from "axios";
import { getToken } from "../utils/Auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api/user",
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updateDailyCoding = () => API.post("/daily-coding");
export const updateInterviewSession = () => API.post("/interview-session");
export const updateQuizSession = () => API.post("/quiz-session");
