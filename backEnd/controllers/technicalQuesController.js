const callGroq = require("../utils/groqClient");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../middleware/asyncHandler");
const Analysis = require("../models/Analysis");

function extractJSON(text) {
    try {
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        return null;
    }
}

const technicalQuesController = asyncHandler(async (req, res) => {
    const { analysisId } = req.body;

    if (!analysisId) {
        throw new ApiError(400, "Analysis ID is required.");
    }

    // 1️⃣ Find analysis in DB
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
        throw new ApiError(404, "Analysis not found.");
    }

    // 2️⃣ Verify ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to this analysis.");
    }

    // 3️⃣ If technicalQuestions already exists, return immediately
    if (analysis.technicalQuestions) {
        console.log("⚡ Returning stored technicalQuestions from DB");
        return res.json(analysis.technicalQuestions);
    }

    const {
        missingSkills = [],
        matchingSkills = [],
        jobRole = "Software Engineer"
    } = analysis;

    const prompt = `
You are a senior software engineering interviewer.

Target Role:
${jobRole}

Candidate Existing Skills:
${matchingSkills.join(", ")}

Candidate Missing Skills:
${missingSkills.join(", ")}

Generate a personalized technical interview preparation set.

Requirements:
- Generate exactly 10 questions.
- Focus 70% on missing skills.
- Focus 30% on existing skills.
- Include:
  - 4 Easy questions
  - 4 Medium questions
  - 2 Hard questions
- Questions must be relevant to the target role.
- Include practical and scenario-based questions where appropriate.
- Answers should be concise, accurate, and interview-ready.

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "",
      "difficulty": "Easy | Medium | Hard",
      "topic": "",
      "answer": ""
    }
  ]
}
`;

    console.log("📤 Calling Groq for Technical Questions...");
    const output = await callGroq(prompt);
    const result = extractJSON(output);

    if (!result) {
        throw new ApiError(
            500,
            "Invalid AI response"
        );
    }

    // 4️⃣ Save to DB
    analysis.technicalQuestions = result;
    await analysis.save();

    console.log("✅ Saved technicalQuestions to DB");
    res.json(result);
});

module.exports = technicalQuesController;