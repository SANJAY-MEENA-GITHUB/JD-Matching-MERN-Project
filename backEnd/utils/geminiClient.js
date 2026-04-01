// using GEMINI model using API calls


// const {GoogleGenAI} = require("@google/genai")
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const axios = require("axios");

// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});


// async function callGemini(prompt) {
//   console.log(process.env.GEMINI_KEY)
//     const res = await ai.models.generateContent({
//         model: 'gemini-1.5-flash-latest',
//         // contents: "Hello"
//         contents: [{
//             role: "user",
//             parts: [{text: prompt}]
//         }]
//     });
//     console.log(res.text);

//     // return response.data.candidates[0].content.parts[0].text;
//     return res.text;
// }

// module.exports = callGemini;




// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function callGemini(prompt) {
//     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     return response.text();
// }

// module.exports = callGemini;





// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function callGemini(prompt) {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash-latest"
//     });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     return response.text();
//   } catch (err) {
//     console.error("GEMINI ERROR:", err);
//     throw err;
//   }
// }

// module.exports = callGemini;





const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function callGemini(prompt) {
  try {
    console.log("KEY:", process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();
    console.log("RESPONSE:", text);

    return text;

  } catch (err) {
  console.error("FULL ERROR:", JSON.stringify(err, null, 2));
 
  throw err;
}
}

module.exports = callGemini;