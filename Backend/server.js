require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const aiRoutes = require("./src/routes/ai.routes");

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173", 
  "https://codesavant-ai-frontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
    message: { error: "Too many requests, please try again later." },
  })
);

app.get("/", (req, res) => {
  res.send("✅ CodeSavant-AI Backend running successfully!");
});

app.use("/ai", aiRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server live on port ${PORT}`);
});
