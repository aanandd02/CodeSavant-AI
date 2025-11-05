// src/routes/ai.routes.js
const express = require("express");
const aiService = require("../services/ai.service");

const router = express.Router();

// POST /ai/get-review
router.post("/get-review", async (req, res) => {
  try {
    const { code } = req.body;

    // Validation
    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ error: "Valid 'code' is required in request body." });
    }

    // Call AI service
    const review = await aiService(code);
    res.json({ review });
  } catch (error) {
    console.error("🔥 AI Review Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while reviewing code." });
  }
});

module.exports = router;
