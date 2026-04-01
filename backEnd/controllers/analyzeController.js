//for GEMINI Model

// const Analysis = require("../models/Analysis");
// const pdfParse = require("pdf-parse");

// const path = require("path");

// const callGemini = require("../utils/geminiClient")
// // const callGroq = require("../utils/groqClient");


// // console.log("🔥 analyzeController FILE LOADED");
// console.log("🔥 GEMINI MODULE TYPE:", typeof callGemini);

// function extractJSON(text) {
//     const match = text.match(/\{[\s\S]*\}/);
//     return match ? match[0] : null;
// }


// const analyzeController = async (req, res) => {
//     try {
//         // 1️⃣ Resume required
//         if (!req.files || !req.files.resume) {
//             return res.status(400).json({ error: "Resume PDF required" });
//         }

//         // 2️⃣ Extract Resume
//         const resumeText = (await pdfParse(req.files.resume[0].buffer)).text;

//         // 3️⃣ Extract JD
//         let jdText = "";

//         if (req.body.jdText && req.body.jdText.trim()) {
//             jdText = req.body.jdText;
//         } else if (req.files.jdPdf) {
//             jdText = (await pdfParse(req.files.jdPdf[0].buffer)).text;
//         }

//         if (!jdText) {
//             return res.status(400).json({ error: "Job Description required" });
//         }

//         // 4️⃣ Prompt
//         const prompt = `
// You are an ATS system.

// Compare RESUME and JOB DESCRIPTION.

// Return STRICT JSON only:

// {
//   "matchPercentage": number,
//   "matchingSkills": [],
//   "missingSkills": [],
//   "improvements": []
// }

// RESUME:
// ${resumeText}

// JOB DESCRIPTION:
// ${jdText}
//         `;

//         // 5️⃣ Call Gemini
//         console.log("TYPE OF callGemini:", typeof callGemini);

//         const geminiOutput = await callGemini(prompt);

//         // 6️⃣ Parse JSON safely
//         const jsonString = extractJSON(geminiOutput);
//         if (!jsonString) {
//             return res.json({
//                 warning: "No JSON found in Gemini response",
//                 raw: geminiOutput
//             });
//         }

        

//         const result = JSON.parse(jsonString);

//         // ✅ SAVE TO DATABASE
//         const savedData = await Analysis.create({
//             matchPercentage: result.matchPercentage,
//             matchingSkills: result.matchingSkills,
//             missingSkills: result.missingSkills,
//             improvements: result.improvements,

//             // optional (be careful with size)
//             // resumeText,
//             // jdText
//         });

//         console.log("Saved to DB:", savedData);
//         // console.log(result);    //print output on console (api response)


//         res.status(201).json({
//             success: true,
//             data: savedData
//         })
        
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// };

// module.exports = analyzeController;




//for GROQ Model

const Analysis = require("../models/Analysis");
const pdfParse = require("pdf-parse");
const callGroq = require("../utils/groqClient");

// Debug
console.log("🔥 GROQ MODULE TYPE:", typeof callGroq);

// ✅ Safe JSON extractor
function extractJSON(text) {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
    } catch (err) {
        return null;
    }
}

const analyzeController = async (req, res) => {
    try {
        // 1️⃣ Resume required
        if (!req.files || !req.files.resume) {
            return res.status(400).json({ error: "Resume PDF required" });
        }

        // 2️⃣ Extract Resume Text
        const resumeText = (
            await pdfParse(req.files.resume[0].buffer)
        ).text;

        // 3️⃣ Extract Job Description
        let jdText = "";

        if (req.body.jdText && req.body.jdText.trim()) {
            jdText = req.body.jdText;
        } else if (req.files.jdPdf) {
            jdText = (
                await pdfParse(req.files.jdPdf[0].buffer)
            ).text;
        }

        if (!jdText) {
            return res.status(400).json({ error: "Job Description required" });
        }

        // 4️⃣ Prompt for Groq
        const prompt = `
You are an ATS (Applicant Tracking System).

Compare RESUME and JOB DESCRIPTION.

⚠️ RULES:
- Return ONLY valid JSON
- No explanation, no extra text
- Be strict and realistic

FORMAT:
{
  "matchPercentage": number,
  "matchingSkills": [],
  "missingSkills": [],
  "improvements": []
}

SCORING:
- Score from 0 to 100
- Focus on technical skills, experience, and keywords

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
        `;

        console.log("📤 Sending to Groq...");

        // 5️⃣ Call Groq
        const groqOutput = await callGroq(prompt);

        console.log("📥 Raw AI Output:", groqOutput);

        // 6️⃣ Extract JSON
        const result = extractJSON(groqOutput);

        if (!result) {
            return res.json({
                warning: "Invalid JSON from AI",
                raw: groqOutput
            });
        }

        // 7️⃣ Save to DB
        const savedData = await Analysis.create({
            matchPercentage: result.matchPercentage,
            matchingSkills: result.matchingSkills,
            missingSkills: result.missingSkills,
            improvements: result.improvements,
        });

        console.log("✅ Saved to DB:", savedData);

        // 8️⃣ Response
        res.status(201).json({
            success: true,
            data: savedData
        });

    } catch (err) {
        console.error("❌ SERVER ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = analyzeController;






