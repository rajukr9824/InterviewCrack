const test = require("node:test");
const assert = require("node:assert/strict");

process.env.API_KEY_ENCRYPTION_SECRET = "embedding-config-test-secret";

const {
  getSupportedEmbeddingConfig,
  validateEmbeddingSelection,
  getEmbeddingConfigStatus,
  getUserEmbeddingConfig,
  encryptEmbeddingKey,
} = require("../services/embeddingConfigService");

test("accepts the supported Gemini embedding model", () => {
  assert.deepEqual(
    getSupportedEmbeddingConfig("gemini", "gemini-embedding-001"),
    { models: ["gemini-embedding-001", "text-embedding-004"], requiresApiKey: true },
  );
  assert.equal(
    validateEmbeddingSelection(
      "gemini",
      "gemini-embedding-001",
      "valid-gemini-key",
      false,
    ),
    null,
  );
});

test("rejects unsupported embedding providers and missing keys", () => {
  assert.match(
    validateEmbeddingSelection("openai", "text-embedding-3-small", "", false),
    /Unsupported/,
  );
  assert.match(
    validateEmbeddingSelection("gemini", "gemini-embedding-001", "", false),
    /required/,
  );
});

test("status and server-side resolution never expose encrypted or plaintext keys in status", () => {
  const encrypted = encryptEmbeddingKey("valid-gemini-key");
  const user = {
    embeddingConfig: {
      provider: "gemini",
      model: "gemini-embedding-001",
      apiKey: encrypted,
    },
  };

  assert.deepEqual(getEmbeddingConfigStatus(user), {
    provider: "gemini",
    model: "gemini-embedding-001",
    keyConfigured: true,
    supported: true,
  });
  assert.equal(getEmbeddingConfigStatus(user).apiKey, undefined);
  assert.deepEqual(getUserEmbeddingConfig(user), {
    provider: "gemini",
    model: "gemini-embedding-001",
    apiKey: "valid-gemini-key",
  });
});
