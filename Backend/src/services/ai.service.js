const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateReview(code) {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a Senior Software Engineer (10+ Years Experience).

Tasks:
1. Detect mistakes (syntax, undefined vars, logical/performance issues).
2. Suggest improvements (best practices, readability, optimization).
3. Always provide the final corrected code ONLY inside one code block.
4. Format response as:
   - **Mistakes/Issues**
   - **Improvements**
   - Then the corrected code block.
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
