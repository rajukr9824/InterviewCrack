const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const learnRoute=require("./routes/learnRoute");
const quizRoute = require("./routes/quizRoute");
const codingRoutes=require("./routes/codingRoutes")
const userRoutes=require("./routes/userRoutes")

dotenv.config();
connectDB();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://interview-crack-five.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);







app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));



app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/learn", learnRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/coding", codingRoutes);
app.use("/api/user", require("./routes/userRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


