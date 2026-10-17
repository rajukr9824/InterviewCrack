const User = require("../models/User");
const {
  PROVIDERS,
  encryptApiKey,
  validateApiKey,
  getApiKeyStatus,
} = require("../services/apiKeyService");

// GET logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -apiKeys");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE profile (name, avatar)
const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered with another account",
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.apiKeys;

    res.json({
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({
        message: "Email is already registered with another account",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// DELETE profile
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DAILY CODING PRACTICE (STREAK LOGIC)
const updateDailyCoding = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.stats.lastCodingDate
      ? new Date(user.stats.lastCodingDate)
      : null;

    if (!lastDate) {
      // first time coding
      user.stats.dailyCodingStreak = 1;
    } else {
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // consecutive day
        user.stats.dailyCodingStreak += 1;
      } else if (diffDays > 1) {
        // missed a day
        user.stats.dailyCodingStreak = 1;
      }
      // diffDays === 0 → same day → do nothing
    }

    user.stats.lastCodingDate = today;
    await user.save();

    res.json({
      message: "Daily coding updated",
      dailyCodingStreak: user.stats.dailyCodingStreak,
    });
  } catch (error) {
    console.error("Daily Coding Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// INTERVIEW PRACTICE SESSION
const updateInterviewSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.stats.interviewSessions += 1;
    await user.save();

    res.json({
      message: "Interview session recorded",
      interviewSessions: user.stats.interviewSessions,
    });
  } catch (error) {
    console.error("Interview Session Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// QUIZ PRACTICE SESSION
const updateQuizSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.stats.quizSessions += 1;
    await user.save();

    res.json({
      message: "Quiz session recorded",
      quizSessions: user.stats.quizSessions,
    });
  } catch (error) {
    console.error("Quiz Session Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getApiKeys = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("apiKeys");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ apiKeys: getApiKeyStatus(user) });
  } catch (error) {
    if (error.message === "API_KEY_ENCRYPTION_SECRET is not configured") {
      return res.status(503).json({ message: "API key storage is not configured" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

const updateApiKeys = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({ message: "A provider key payload is required" });
    }
    if (Buffer.byteLength(JSON.stringify(payload), "utf8") > 4096) {
      return res.status(413).json({ message: "API key payload is too large" });
    }

    const requestedProviders = Object.keys(payload);
    const unsupportedProvider = requestedProviders.find(
      (provider) => !PROVIDERS.includes(provider),
    );
    if (unsupportedProvider) {
      return res.status(400).json({ message: `Unsupported provider: ${unsupportedProvider}` });
    }

    if (requestedProviders.length === 0) {
      return res.status(400).json({ message: "At least one provider key is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.apiKeys) {
      user.apiKeys = {};
    }

    for (const provider of requestedProviders) {
      const validationError = validateApiKey(payload[provider], provider);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      user.apiKeys[provider] = encryptApiKey(payload[provider].trim());
    }

    await user.save();
    return res.json({
      message: "API keys updated successfully",
      apiKeys: getApiKeyStatus(user),
    });
  } catch (error) {
    if (error.message === "API_KEY_ENCRYPTION_SECRET is not configured") {
      return res.status(503).json({ message: "API key storage is not configured" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const { provider } = req.params;
    if (!PROVIDERS.includes(provider)) {
      return res.status(400).json({ message: `Unsupported provider: ${provider}` });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.set(`apiKeys.${provider}`, undefined);
    await user.save();

    return res.json({
      message: `${provider} API key removed successfully`,
      apiKeys: getApiKeyStatus(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updateDailyCoding,
  updateInterviewSession,
  updateQuizSession,
  getApiKeys,
  updateApiKeys,
  deleteApiKey,
};
