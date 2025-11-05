// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const aiRoutes = require("./src/routes/ai.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- Middlewares --------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: { error: "Too many requests, please try again later." },
  })
);

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("Hello World - LangChain Gemini Backend 🚀");
});

app.use("/ai", aiRoutes);

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
