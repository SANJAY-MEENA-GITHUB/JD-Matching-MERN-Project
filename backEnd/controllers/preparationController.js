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

const preparationController = asyncHandler(async (req, res) => {
    const { analysisId } = req.body;

    if (!analysisId) {
        throw new ApiError(400, "Analysis ID is required.");
    }

    // 1️⃣ Find analysis in database
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
        throw new ApiError(404, "Analysis not found.");
    }

    // 2️⃣ Verify ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to this analysis.");
    }

    // 3️⃣ If preparationPlan already exists, return it immediately
    if (analysis.preparationPlan) {
        console.log("⚡ Returning stored preparationPlan from DB");
        return res.json(analysis.preparationPlan);
    }

    const { missingSkills } = analysis;

    if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
        // If there are no missing skills, return a default empty/success structure
        const emptyPlan = {
            skillGaps: [],
            preparationPlan: []
        };
        analysis.preparationPlan = emptyPlan;
        await analysis.save();
        return res.json(emptyPlan);
    }

    const prompt = `
You are a career mentor.

Missing Skills:
${missingSkills.join(", ")}

Return ONLY valid JSON.

{
  "skillGaps":[
    {
      "skill":"",
      "severity":"low",
      "reason":""
    }
  ],

  "preparationPlan":[
    {
      "day":1,
      "focus":"",
      "tasks":[]
    }
  ]
}

RULES:

- severity must be low, medium or high
- create exactly 7 days
- focus more on high severity skills
- tasks should be actionable
- return JSON only
`;

    console.log("📤 Calling Groq for Preparation Plan...");
    const output = await callGroq(prompt);
    const result = extractJSON(output);

    if (!result) {
        throw new ApiError(
            500,
            "AI returned an invalid response."
        );
    }

    // 4️⃣ Save generated result into the Analysis document
    analysis.preparationPlan = result;
    await analysis.save();

    console.log("✅ Saved preparationPlan to DB");
    res.json(result);
});

module.exports = preparationController;