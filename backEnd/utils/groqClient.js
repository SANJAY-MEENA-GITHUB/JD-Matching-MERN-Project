require("dotenv").config();         // must require this here for groq api key fetch

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 Debug (temporary — remove later)
// console.log("GROQ KEY:", groq);

async function callGroq(prompt) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    //   model: "llama3-70b-8192", 
    //   model: "llama-3.1-70b-versatile",
    //   model: "llama-3.3-8b-instant",
      model: "openai/gpt-oss-120b",

      temperature: 0.3,         // ✅ better for JSON output
      max_tokens: 1500,
    });

    return response.choices?.[0]?.message?.content || "";

  } catch (err) {
    console.error("❌ GROQ ERROR:", err.message || err);
    throw err;
  }
}

module.exports = callGroq;