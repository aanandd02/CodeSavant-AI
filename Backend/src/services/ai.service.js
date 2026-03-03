const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateReview(code, language = "javascript") {
  const allowedLanguages = ["javascript", "c", "cpp", "java"];
  if (!allowedLanguages.includes(language)) {
    language = "javascript";
  }
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a Senior ${language} Software Engineer (10+ Years Experience).

Review the given ${language} code.

Tasks:
1. Detect syntax errors specific to ${language}.
2. Detect logical or performance issues.
3. Suggest best practices for ${language}.
4. Always provide the final corrected ${language} code ONLY inside one code block.
5. Format response using:
   🔴 Mistakes
   💡 Improvements
   🛠 Corrected Code
          `,
        },
        {
          role: "user",
          content: code,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("🔥 Groq AI Error:", error.message);
    throw error;
  }
}

module.exports = generateReview;
