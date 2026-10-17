const crypto = require("crypto");
const User = require("../models/User");

const PROVIDERS = ["gemini", "openai"];
const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getEncryptionKey = () => {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error("API_KEY_ENCRYPTION_SECRET is not configured");
  }

  return crypto.createHash("sha256").update(secret, "utf8").digest();
};

const encryptApiKey = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  return {
    encrypted: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
};

const decryptApiKey = (encryptedKey) => {
  if (!encryptedKey?.encrypted || !encryptedKey?.iv || !encryptedKey?.authTag) {
    return null;
  }

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    Buffer.from(encryptedKey.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(encryptedKey.authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedKey.encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
};

const validateApiKey = (value, provider) => {
  if (typeof value !== "string") {
    return `${provider} API key must be a string`;
  }

  const key = value.trim();
  if (key.length < 10 || key.length > 512) {
    return `${provider} API key must be between 10 and 512 characters`;
  }

  return null;
};

const getUserApiKeys = async (userId) => {
  const user = await User.findById(userId).select("apiKeys");
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const keys = {};
  for (const provider of PROVIDERS) {
    const encryptedKey = user.apiKeys?.[provider];
    if (encryptedKey) {
      keys[provider] = decryptApiKey(encryptedKey);
    }
  }

  return keys;
};

const getApiKeyStatus = (user) =>
  PROVIDERS.reduce((status, provider) => {
    status[provider] = Boolean(user.apiKeys?.[provider]?.encrypted);
    return status;
  }, {});

module.exports = {
  PROVIDERS,
  encryptApiKey,
  decryptApiKey,
  validateApiKey,
  getUserApiKeys,
  getApiKeyStatus,
};
