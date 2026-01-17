
import api from "../api/axios";


export const updateDailyCoding = () =>
  api.post("/api/user/daily-coding");

export const updateInterviewSession = () =>
  api.post("/api/user/interview-session");

export const updateQuizSession = () =>
  api.post("/api/user/quiz-session");
