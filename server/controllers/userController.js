const User = require("../models/User");

// GET logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

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
    const { name, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
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

      const diffDays =
        (today - lastDate) / (1000 * 60 * 60 * 24);

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

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  updateDailyCoding,
  updateInterviewSession,
  updateQuizSession,
};
