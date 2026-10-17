const {
  encryptApiKey,
  decryptApiKey,
  validateApiKey,
} = require("./apiKeyService");

const EMBEDDING_CONFIGS = {
  gemini: {
    models: ["text-embedding-004"],
    requiresApiKey: true,
  },
};

const getSupportedEmbeddingConfig = (provider, model) => {
  const config = EMBEDDING_CONFIGS[provider];
  if (!config || !config.models.includes(model)) {
    return null;
  }
  return config;
};

const validateEmbeddingSelection = (provider, model, apiKey, hasExistingKey) => {
  const config = getSupportedEmbeddingConfig(provider, model);
  if (!config) {
    return "Unsupported embedding provider or model.";
  }

  if (config.requiresApiKey && !apiKey && !hasExistingKey) {
    return "An API key is required for the selected embedding provider.";
  }

  if (apiKey) {
    return validateApiKey(apiKey, `${provider} embedding`);
  }

  return null;
};

const getEmbeddingConfigStatus = (user) => {
  const config = user.embeddingConfig;
  return {
    provider: config?.provider || null,
    model: config?.model || null,
    keyConfigured: Boolean(config?.apiKey?.encrypted),
    supported: Boolean(
      config?.provider &&
        config?.model &&
        getSupportedEmbeddingConfig(config.provider, config.model),
    ),
  };
};

const getUserEmbeddingConfig = (user) => {
  const status = getEmbeddingConfigStatus(user);
  if (!status.provider || !status.model || !status.keyConfigured) {
    const error = new Error(
      "Configure an embedding model and API key in your profile before indexing repositories.",
    );
    error.status = 400;
    throw error;
  }

  const apiKey = decryptApiKey(user.embeddingConfig.apiKey);
  if (!apiKey) {
    const error = new Error("The saved embedding API key is invalid or unavailable.");
    error.status = 400;
    throw error;
  }

  return {
    provider: status.provider,
    model: status.model,
    apiKey,
  };
};

const encryptEmbeddingKey = (apiKey) => (apiKey ? encryptApiKey(apiKey.trim()) : undefined);

module.exports = {
  EMBEDDING_CONFIGS,
  getSupportedEmbeddingConfig,
  validateEmbeddingSelection,
  getEmbeddingConfigStatus,
  getUserEmbeddingConfig,
  encryptEmbeddingKey,
};
