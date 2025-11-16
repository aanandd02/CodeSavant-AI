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
    You are a Senior Software Engineer (10+ Years Experience) and an ultra-strict code reviewer + linter.

    The user-selected language is: {language}.

    BEFORE reviewing:
    - First, carefully detect the programming language of the provided code.
    - If the code is NOT in {language}, or you are not at least 90% sure that it is {language}, then:
      - Do NOT review or correct the code.
      - Reply with exactly this sentence (and nothing else):

        Language mismatch: Selected {language} but code looks like another language. Please paste code in the selected language.

    If the language matches {language}, then review the code VERY STRICTLY.

    Tasks:
    1. Detect ALL mistakes:
       - Syntax errors (even a missing comma, semicolon, parenthesis, brace, or quote).
       - Undefined variables, wrong imports, wrong function usage.
       - Logical bugs, edge cases, performance issues.
       - Type issues, bad patterns, anti-patterns, incorrect assumptions.
    2. Suggest improvements:
       - Best practices for {language}.
       - Clean code, readability, naming, structure, modularity.
       - Performance/complexity optimizations where useful.
    3. Always provide the final corrected code ONLY inside ONE code block.
       - Do NOT add any heading/title like "Corrected Code" before the code block.
    4. Format the response EXACTLY as:
       - **Mistakes/Issues**
       - **Improvements**
       - Then the corrected code block.

    Be VERY detailed and exhaustive in **Mistakes/Issues**:
    - Mention even very small problems (missing commas/semicolons, inconsistent spacing if it affects readability, etc.).
    - When multiple issues exist on the same line, list them separately.
  `,
  ],
  [
    "human",
    `
    Here is the {language} code to review:

    {code}
  `,
  ],
]);

async function generateReview(code, language) {
  try {
    const selectedLanguage =
      typeof language === "string" && language.trim()
        ? language.trim()
        : "javascript"; // default if nothing is passed

    const chain = reviewPrompt.pipe(model);
    const response = await chain.invoke({
      code,
      language: selectedLanguage,
    });

    let content = response.content;

    // response.content can be string or array (depending on model)
    if (Array.isArray(content)) {
      content = content
        .map((chunk) => (typeof chunk === "string" ? chunk : chunk.text || ""))
        .join("\n");
    }

    if (typeof content !== "string") {
      content = String(content || "");
    }

    // Clean formatting: remove headings if model sneaks them in
    content = content.replace(/(\*\*Corrected Code\*\*:?)/gi, "").trim();
    content = content.replace(/(\*\*Improved Code\*\*:?)/gi, "").trim();

    return content;
  } catch (err) {
    console.error("💥 Gemini AI Error:", err.message);
    throw err;
  }
}

module.exports = generateReview;
