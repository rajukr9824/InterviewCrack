import api from "../api/axios";

/**
 * 1. Index a repository
 * POST /api/repository/index
 * Body: { repository_url }
 */
export const indexRepository = async (repositoryUrl) => {
  const res = await api.post("/api/repository/index", {
    repository_url: repositoryUrl,
  });
  return res.data;
};

/**
 * 2. Chat with repository (RAG)
 * POST /api/repository/chat
 * Body: { repository_name, question, top_k }
 */
export const chatRepository = async (repositoryName, question, topK) => {
  const payload = {
    repository_name: repositoryName,
    question,
  };
  if (topK !== undefined && topK !== null) {
    payload.top_k = topK;
  }
  const res = await api.post("/api/repository/chat", payload);
  return res.data;
};

/**
 * 3. Start repository-aware project interview
 * POST /api/repository/interview/start
 * Body: { repository_name, difficulty }
 */
export const startRepositoryInterview = async (repositoryName, difficulty = "medium") => {
  const res = await api.post("/api/repository/interview/start", {
    repository_name: repositoryName,
    difficulty,
  });
  return res.data;
};

/**
 * 4. Submit answer for project interview
 * POST /api/repository/interview/answer
 * Body: { session_id, answer }
 */
export const submitRepositoryInterviewAnswer = async (sessionId, answer) => {
  const res = await api.post("/api/repository/interview/answer", {
    session_id: sessionId,
    answer,
  });
  return res.data;
};

/**
 * 5. End project interview
 * POST /api/repository/interview/end
 * Body: { session_id }
 */
export const endRepositoryInterview = async (sessionId) => {
  const res = await api.post("/api/repository/interview/end", {
    session_id: sessionId,
  });
  return res.data;
};

/**
 * 6. Get interview session state
 * GET /api/repository/interview/session/:session_id
 */
export const getRepositoryInterviewSession = async (sessionId) => {
  const res = await api.get(`/api/repository/interview/session/${sessionId}`);
  return res.data;
};
