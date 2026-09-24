const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    stats: {
      interviewSessions: {
        type: Number,
        default: 0,
      },

      quizSessions: {
        type: Number,
        default: 0,
      },

      dailyCodingStreak: {
        type: Number,
        default: 0,
      },

      lastCodingDate: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
