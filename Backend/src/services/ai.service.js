// src/services/ai.service.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

const reviewPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
    You are a Senior Software Engineer (10+ Years Experience).
    Review the code carefully.

    Tasks:
    1. Detect mistakes (syntax, undefined vars, logical/performance issues).
    2. Suggest improvements (best practices, readability, optimization).
    3. Always provide the final corrected code ONLY inside one code block.
       ❌ Do NOT write any extra heading like "Corrected Code", "Improved Code" etc.
    4. Format response as:
       - **Mistakes/Issues**
       - **Improvements**
       - Then directly the corrected code block.
  `,
  ],
  ["human", "{code}"],
]);

async function generateReview(code) {
  try {
    const chain = reviewPrompt.pipe(model);
    const response = await chain.invoke({ code });
    let content = response.content;

    // Clean up unwanted headings
    content = content.replace(/(\*\*Corrected Code\*\*:?)/gi, "").trim();
    content = content.replace(/(\*\*Improved Code\*\*:?)/gi, "").trim();

    return content;
  } catch (err) {
    console.error("💥 Gemini AI Error:", err.message);
    throw err;
  }
}

module.exports = generateReview;
