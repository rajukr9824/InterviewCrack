const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  res.json({ message: "User registered" });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. INPUT VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // 2. FIND USER & EXPLICITLY SELECT PASSWORD
    const user = await User.findOne({ email }).select("+password"); 
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. COMPARE HASHED PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. GENERATE JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. SUCCESS RESPONSE
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login };
