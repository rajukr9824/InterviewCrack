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

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/learn", learnRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/coding", codingRoutes);
app.use("/api/user", require("./routes/userRoutes"));



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
