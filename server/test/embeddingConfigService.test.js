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
    getSupportedEmbeddingConfig("gemini", "text-embedding-004"),
    { models: ["text-embedding-004"], requiresApiKey: true },
  );
  assert.equal(
    validateEmbeddingSelection(
      "gemini",
      "text-embedding-004",
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
    validateEmbeddingSelection("gemini", "text-embedding-004", "", false),
    /required/,
  );
});

test("status and server-side resolution never expose encrypted or plaintext keys in status", () => {
  const encrypted = encryptEmbeddingKey("valid-gemini-key");
  const user = {
    embeddingConfig: {
      provider: "gemini",
      model: "text-embedding-004",
      apiKey: encrypted,
    },
  };

  assert.deepEqual(getEmbeddingConfigStatus(user), {
    provider: "gemini",
    model: "text-embedding-004",
    keyConfigured: true,
    supported: true,
  });
  assert.equal(getEmbeddingConfigStatus(user).apiKey, undefined);
  assert.deepEqual(getUserEmbeddingConfig(user), {
    provider: "gemini",
    model: "text-embedding-004",
    apiKey: "valid-gemini-key",
  });
});
