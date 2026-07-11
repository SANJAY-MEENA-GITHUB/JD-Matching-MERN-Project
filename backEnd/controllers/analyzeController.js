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
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError")

// Debug
// console.log("🔥 GROQ MODULE TYPE:", typeof callGroq);

// ✅ Safe JSON extractor
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    return null;
  }
}

const analyzeController = asyncHandler(async (req, res) => {
  // 1️⃣ Resume required
  if (!req.files?.resume) {
    throw new ApiError(
      400,
      "Resume PDF is required."
    );
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
    throw new ApiError(
      400,
      "Job description is required."
    );
  }

  //prevents future token-limit issues when someone pastes a massive job description
  jdText = jdText.slice(0, 4000);



  // 4️⃣ Prompt for Groq
  const prompt = `
You are an ATS (Applicant Tracking System) and Resume Analyzer.

Analyze the RESUME against the JOB DESCRIPTION.

IMPORTANT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- No extra text.
- Score must be between 0 and 100.
- Be realistic and strict.

Return JSON in this exact format:

{
  "matchPercentage": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "improvements": [],
  "jobRole": "Software Engineer",
}

GUIDELINES:

1. matchPercentage
   - Calculate based on skills, technologies, projects, experience, and keywords.

2. matchingSkills
   - Skills present in both resume and job description.

3. missingSkills
   - Important skills mentioned in the job description but missing from the resume.

4. improvements
   - Specific actionable suggestions to improve the resume for this job.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

  console.log("📤 Sending to Groq...");

  //debug
  // console.log("Resume chars:", resumeText.length);
  // console.log("JD chars:", jdText.length);
  // console.log("Prompt chars:", prompt.length);
  // console.log(prompt.slice(0, 1000));


  // 5️⃣ Call Groq
  const groqOutput = await callGroq(prompt);

  // console.log("📥 Raw AI Output:", groqOutput);

  // 6️⃣ Extract JSON
  const result = extractJSON(groqOutput);

  if (
    !result ||
    typeof result.matchPercentage !== "number" ||
    !Array.isArray(result.matchingSkills) ||
    !Array.isArray(result.missingSkills) ||
    !Array.isArray(result.improvements)
  ) {
    throw new ApiError(
      500,
      "AI returned an invalid response."
    );
  }

  // 7️⃣ Save to DB
  // const savedData = await Analysis.create({
  //   matchPercentage: result.matchPercentage,
  //   matchingSkills: result.matchingSkills,
  //   missingSkills: result.missingSkills,
  //   improvements: result.improvements,
  // });
  const analysis = await Analysis.create({
    user: req.user._id,
    matchPercentage: result.matchPercentage,
    matchingSkills: result.matchingSkills,
    missingSkills: result.missingSkills,
    improvements: result.improvements,
    jobRole: result.jobRole
    // skillGaps: result.skillGaps
  });

  console.log("✅ Saved to DB:", analysis);

  // 8️⃣ Response
  // res.status(201).json({
  //   success: true,
  //   data: savedData
  // });

  res.json(analysis);
});

module.exports = analyzeController;






