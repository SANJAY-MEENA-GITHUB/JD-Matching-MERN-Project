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

const resourceController = asyncHandler(async (req, res) => {
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

  // 3️⃣ If resources already exist, return immediately
  if (analysis.resources) {
    console.log("⚡ Returning stored resources from DB");
    return res.json(analysis.resources);
  }

  const { missingSkills } = analysis;

  if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
    const emptyResources = { resources: [] };
    analysis.resources = emptyResources;
    await analysis.save();
    return res.json(emptyResources);
  }

  const prompt = `
You are a software engineering mentor.

From the following list of skills, identify only the primary, core, or main skills (ignore minor, overly specific, or redundant ones) and generate high-quality learning resources for them:

${missingSkills.join(", ")}

Return ONLY JSON:

{
  "resources":[
    {
      "skill":"",
      "youtube":[
        {
          "title":"",
          "url":""
        }
      ],
      "articles":[
        {
          "title":"",
          "url":""
        }
      ]
    }
  ]

  provide official documentation in place of any article or 
}
`;

  console.log("📤 Calling Groq for Learning Resources...");
  const output = await callGroq(prompt);
  const result = extractJSON(output);

  if (!result) {
    throw new ApiError(
      500,
      "AI returned an Invalid response"
    );
  }

  // 4️⃣ Save to DB
  analysis.resources = result;
  await analysis.save();

  console.log("✅ Saved resources to DB");
  res.json(result);
});

module.exports = resourceController;