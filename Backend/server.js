require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const serverless = require("serverless-http");

const aiRoutes = require("./src/routes/ai.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://codesavant-ai-frontend.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "CodeSavant-AI running on Lambda 🚀" });
});

app.use("/ai", aiRoutes);

module.exports.handler = serverless(app);