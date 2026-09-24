const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.init();
  console.log("MongoDB connected");
};

module.exports = connectDB;
