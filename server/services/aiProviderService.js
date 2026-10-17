const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getUserApiKeys } = require("./apiKeyService");

const getProviderClients = async (userId) => {
  const keys = await getUserApiKeys(userId);
  const clients = {};

  if (keys.openai) {
    clients.openai = new OpenAI({ apiKey: keys.openai });
  }
  if (keys.gemini) {
    clients.gemini = new GoogleGenerativeAI(keys.gemini);
  }

  if (!clients.openai && !clients.gemini) {
    const error = new Error(
      "Configure a Gemini or OpenAI API key in your profile before using AI features.",
    );
    error.status = 400;
    throw error;
  }

  return { keys, clients };
};

const sendMissingKeyError = (res, error) => {
  if (error.status === 400 || error.status === 404) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.message === "API_KEY_ENCRYPTION_SECRET is not configured") {
    return res.status(503).json({ message: "API key storage is not configured" });
  }
  return null;
};

module.exports = { getProviderClients, sendMissingKeyError };
