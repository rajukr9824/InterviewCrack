const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || process.env.FASTAPI_URL || "http://127.0.0.1:8000";

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 120000, // 2 minutes, as repository indexing and LLM operations might take time
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Handle axios error and throw a cleaner error structure.
 */
const handleAxiosError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("FastAPI Error Response:", error.response.status, error.response.data);
    const message = error.response.data?.detail || error.response.data?.message || "Error from FastAPI service";
    const status = error.response.status || 500;
    
    const err = new Error(message);
    err.status = status;
    err.data = error.response.data;
    throw err;
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received from FastAPI:", error.message);
    const err = new Error("FastAPI service is unreachable or timed out");
    err.status = 504;
    throw err;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Axios setup error:", error.message);
    const err = new Error("Internal request configuration error");
    err.status = 500;
    throw err;
  }
};

/**
 * 1. Index GitHub Repository
 */
const indexRepository = async (repositoryUrl) => {
  try {
    const response = await aiClient.post("/repository/index", {
      repository_url: repositoryUrl,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 2. Search Repository Chunks
 */
const searchRepository = async (repositoryName, query, topK = 5) => {
  try {
    const response = await aiClient.post("/repository/search", {
      repository_name: repositoryName,
      query,
      top_k: topK,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 3. Chat with Repository (RAG)
 */
const chatRepository = async (repositoryName, question, topK) => {
  try {
    const payload = {
      repository_name: repositoryName,
      question,
    };
    if (topK !== undefined && topK !== null) {
      payload.top_k = topK;
    }
    const response = await aiClient.post("/chat/repository", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 4. Start Repository Interview
 */
const startInterview = async (repositoryName, difficulty = "medium") => {
  try {
    const response = await aiClient.post("/interview/start", {
      repository_name: repositoryName,
      difficulty,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 5. Submit Interview Answer
 */
const submitAnswer = async (sessionId, answer) => {
  try {
    const response = await aiClient.post("/interview/answer", {
      session_id: sessionId,
      answer,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 6. End Interview
 */
const endInterview = async (sessionId) => {
  try {
    const response = await aiClient.post("/interview/end", {
      session_id: sessionId,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 7. Get Interview Session State
 */
const getSession = async (sessionId) => {
  try {
    const response = await aiClient.get(`/interview/session/${sessionId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

module.exports = {
  indexRepository,
  searchRepository,
  chatRepository,
  startInterview,
  submitAnswer,
  endInterview,
  getSession,
};
