const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || process.env.FASTAPI_URL || "http://127.0.0.1:8000";

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 120000, // 2 minutes, as repository indexing and LLM operations might take time
  headers: {
    "Content-Type": "application/json",
  },
});

const getHeaders = (apiKeys = {}, userId, embeddingConfig = {}) => ({
  "x-ai-service-secret": process.env.AI_SERVICE_INTERNAL_SECRET,
  ...(userId ? { "x-user-id": userId } : {}),
  ...(apiKeys.gemini ? { "x-user-gemini-key": apiKeys.gemini } : {}),
  ...(embeddingConfig.apiKey
    ? { "x-user-embedding-key": embeddingConfig.apiKey }
    : {}),
  ...(embeddingConfig.provider
    ? { "x-embedding-provider": embeddingConfig.provider }
    : {}),
  ...(embeddingConfig.model
    ? { "x-embedding-model": embeddingConfig.model }
    : {}),
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
const indexRepository = async (repositoryUrl, apiKeys, userId, embeddingConfig) => {
  try {
    const response = await aiClient.post("/repository/index", {
      repository_url: repositoryUrl,
    }, { headers: getHeaders(apiKeys, userId, embeddingConfig) });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 2. Search Repository Chunks
 */
const searchRepository = async (
  repositoryName,
  query,
  topK = 5,
  apiKeys,
  userId,
  embeddingConfig,
) => {
  try {
    const response = await aiClient.post("/repository/search", {
      repository_name: repositoryName,
      query,
      top_k: topK,
    }, { headers: getHeaders(apiKeys, userId, embeddingConfig) });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 3. Chat with Repository (RAG)
 */
const chatRepository = async (
  repositoryName,
  question,
  topK,
  apiKeys,
  userId,
  embeddingConfig,
) => {
  try {
    const payload = {
      repository_name: repositoryName,
      question,
    };
    if (topK !== undefined && topK !== null) {
      payload.top_k = topK;
    }
    const response = await aiClient.post("/chat/repository", payload, {
      headers: getHeaders(apiKeys, userId, embeddingConfig),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 4. Start Repository Interview
 */
const startInterview = async (
  repositoryName,
  difficulty = "medium",
  apiKeys,
  userId,
  embeddingConfig,
) => {
  try {
    const response = await aiClient.post("/interview/start", {
      repository_name: repositoryName,
      difficulty,
    }, { headers: getHeaders(apiKeys, userId, embeddingConfig) });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 5. Submit Interview Answer
 */
const submitAnswer = async (sessionId, answer, apiKeys, userId, embeddingConfig) => {
  try {
    const response = await aiClient.post("/interview/answer", {
      session_id: sessionId,
      answer,
    }, { headers: getHeaders(apiKeys, userId, embeddingConfig) });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 6. End Interview
 */
const endInterview = async (sessionId, apiKeys, userId, embeddingConfig) => {
  try {
    const response = await aiClient.post("/interview/end", {
      session_id: sessionId,
    }, { headers: getHeaders(apiKeys, userId, embeddingConfig) });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * 7. Get Interview Session State
 */
const getSession = async (sessionId, apiKeys, userId, embeddingConfig) => {
  try {
    const response = await aiClient.get(`/interview/session/${sessionId}`, {
      headers: getHeaders(apiKeys, userId, embeddingConfig),
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const testEmbeddingConfig = async (embeddingConfig, userId) => {
  try {
    const response = await aiClient.post(
      "/embedding/test",
      {},
      { headers: getHeaders({}, userId, embeddingConfig) },
    );
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
  testEmbeddingConfig,
};
