// require("dotenv").config();         // must require this here for groq api key fetch

// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // 🔥 Debug (temporary — remove later)
// // console.log("GROQ KEY:", groq);

// async function callGroq(prompt) {
//   try {
//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       //   model: "llama3-70b-8192", 
//       //   model: "llama-3.1-70b-versatile",
//       //   model: "llama-3.3-8b-instant",
//       model: "openai/gpt-oss-120b",
//       // model: "llama-3.1-8b-instant",


//       temperature: 0.3,         // ✅ better for JSON output
//       max_tokens: 2000,
//     });

//     return response.choices?.[0]?.message?.content || "";

//   } catch (err) {
//     console.error("❌ GROQ ERROR:", err.message || err);
//     throw err;
//   }
// }

// module.exports = callGroq;
















require("dotenv").config(); // must require this here for groq api key fetch

const OpenAI = require("openai");

// Configure the OpenAI client to point to Groq's gateway
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Core utility function to call the Groq API via the OpenAI SDK.
 * @param {string} prompt - The input prompt text.
 * @returns {Promise<string>} The string content response from the model.
 */
async function callGroq(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // ✅ better for JSON output
    });

    // Extract text content using OpenAI's response structure
    return response.choices?.[0]?.message?.content || "";

  } catch (err) {
    console.error("❌ GROQ ERROR:", err.message || err);
    throw err;
  }
}

module.exports = callGroq;