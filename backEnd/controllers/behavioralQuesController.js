const callGroq = require("../utils/groqClient");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
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

const behavioralQuesController = asyncHandler(async (req, res) => {
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

    // 3️⃣ If behavioralQuestions already exists, return immediately
    if (analysis.behavioralQuestions) {
        console.log("⚡ Returning stored behavioralQuestions from DB");
        return res.json(analysis.behavioralQuestions);
    }

    const {
        jobRole = "Software Engineer",
        improvements = []
    } = analysis;

    const prompt = `
You are a senior hiring manager.

Target Role:
${jobRole}

Resume Improvement Areas:
${improvements.join(", ")}

Generate exactly 10 behavioral interview questions.

Requirements:
- Questions should be relevant to the target role.
- Cover teamwork, leadership, communication,
  conflict resolution, ownership, adaptability,
  problem solving and time management.
- Provide concise sample answers.
- Use STAR-method style answers.

Return ONLY valid JSON.

{
  "questions":[
    {
      "question":"",
      "whatInterviewerChecks":"",
      "sampleAnswer":""
    }
  ]
}
`;

    console.log("📤 Calling Groq for Behavioral Questions...");
    const output = await callGroq(prompt);
    const result = extractJSON(output);

    if (!result) {
        throw new ApiError(
            500,
            "AI returned an invalid response."
        );
    }

    // 4️⃣ Save to DB
    analysis.behavioralQuestions = result;
    await analysis.save();

    console.log("✅ Saved behavioralQuestions to DB");
    res.json(result);
});

module.exports = behavioralQuesController;