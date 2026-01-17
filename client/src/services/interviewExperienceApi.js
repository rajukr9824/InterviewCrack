import api from "../api/axios";

// Fetch all / filter by company
// services/interviewExperienceApi.js
export const getInterviewExperiences = ({ company, page, limit }) => {
  return api.get("/api/interview-experiences", {
    params: { company, page, limit },
  });
};

// Add interview experience
export const addInterviewExperience = (data) =>
  api.post("/api/interview-experience", data);

export const getMyInterviewExperiences = () =>
  api.get("/api/interview-experience/my");

export const updateInterviewExperience = (id, data) =>
  api.put(`/api/interview-experience/${id}`, data);

export const deleteInterviewExperience = (id) =>
  api.delete(`/api/interview-experience/${id}`);
