const repositoryService = require("../services/repositoryService");

/**
 * 1. POST /api/repository/index
 * Ingests a repository URL and builds an index.
 */
const indexRepository = async (req, res) => {
  try {
    const { repository_url } = req.body;

    if (!repository_url) {
      return res.status(400).json({
        message: "repository_url is required.",
      });
    }

    const result = await repositoryService.indexRepository(repository_url);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error indexing repository:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to index repository.",
    });
  }
};

/**
 * 2. POST /api/repository/search
 * Searches the repository vector store.
 */
const searchRepository = async (req, res) => {
  try {
    const { repository_name, query, top_k } = req.body;

    if (!repository_name || !query) {
      return res.status(400).json({
        message: "repository_name and query are required.",
      });
    }

    const result = await repositoryService.searchRepository(
      repository_name,
      query,
      top_k
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error searching repository:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to search repository.",
    });
  }
};

/**
 * 3. POST /api/repository/chat
 * Chats with the repository (RAG).
 */
const chatRepository = async (req, res) => {
  try {
    const { repository_name, question, top_k } = req.body;

    if (!repository_name || !question) {
      return res.status(400).json({
        message: "repository_name and question are required.",
      });
    }

    const result = await repositoryService.chatRepository(
      repository_name,
      question,
      top_k
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error chatting with repository:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to process chat request.",
    });
  }
};

/**
 * 4. POST /api/repository/interview/start
 * Starts a repository-aware interview session.
 */
const startInterview = async (req, res) => {
  try {
    const { repository_name, difficulty } = req.body;

    if (!repository_name) {
      return res.status(400).json({
        message: "repository_name is required.",
      });
    }

    const result = await repositoryService.startInterview(
      repository_name,
      difficulty
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error starting repository interview:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to start interview session.",
    });
  }
};

/**
 * 5. POST /api/repository/interview/answer
 * Submits an answer for the current question in the interview session.
 */
const submitAnswer = async (req, res) => {
  try {
    const { session_id, answer } = req.body;

    if (!session_id || !answer) {
      return res.status(400).json({
        message: "session_id and answer are required.",
      });
    }

    const result = await repositoryService.submitAnswer(session_id, answer);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to submit answer.",
    });
  }
};

/**
 * 6. POST /api/repository/interview/end
 * Ends the interview session.
 */
const endInterview = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        message: "session_id is required.",
      });
    }

    const result = await repositoryService.endInterview(session_id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error ending interview:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to end interview session.",
    });
  }
};

/**
 * 7. GET /api/repository/interview/session/:session_id
 * Gets the current state of an interview session.
 */
const getSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    if (!session_id) {
      return res.status(400).json({
        message: "session_id path parameter is required.",
      });
    }

    const result = await repositoryService.getSession(session_id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving session:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to retrieve interview session.",
    });
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
