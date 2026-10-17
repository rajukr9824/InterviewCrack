const assert = require("node:assert/strict");
const test = require("node:test");

const {
  encryptApiKey,
  decryptApiKey,
  validateApiKey,
} = require("../services/apiKeyService");

test("encrypts and decrypts an API key without storing plaintext", () => {
  process.env.API_KEY_ENCRYPTION_SECRET = "test-only-secret";
  const plainText = "provider-secret-key-123";
  const encrypted = encryptApiKey(plainText);

  assert.notEqual(encrypted.encrypted, plainText);
  assert.equal(decryptApiKey(encrypted), plainText);
});

test("authenticated encryption rejects tampered ciphertext", () => {
  process.env.API_KEY_ENCRYPTION_SECRET = "test-only-secret";
  const encrypted = encryptApiKey("provider-secret-key-123");
  encrypted.encrypted = Buffer.from("tampered").toString("base64");

  assert.throws(() => decryptApiKey(encrypted));
});

test("API key validation rejects malformed values", () => {
  assert.match(validateApiKey("short", "gemini"), /between 10 and 512/);
  assert.equal(validateApiKey("valid-provider-key", "openai"), null);
});
