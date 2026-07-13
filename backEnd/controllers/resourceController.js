const fs = require("fs");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Analysis = require("../models/Analysis");

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

  // 4️⃣ Read curated resources database from data/resources.json
  const resourcesPath = path.join(__dirname, "../data/resources.json");
  let courses = [];
  try {
    const fileContent = fs.readFileSync(resourcesPath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    courses = parsedData.courses || [];
  } catch (error) {
    console.error("❌ Error reading or parsing resources.json:", error);
    throw new ApiError(500, "Failed to load curated resources database.");
  }

  // 5️⃣ Search and match missing skills in resources.json
  const matchedResources = [];

  for (const skill of missingSkills) {
    // Try exact match first (case-insensitive)
    let matchedCourse = courses.find(course =>
      course.skill_names.some(name => name.toLowerCase() === skill.toLowerCase())
    );

    // Try substring matching if exact match not found
    if (!matchedCourse) {
      matchedCourse = courses.find(course =>
        course.skill_names.some(name =>
          skill.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    if (matchedCourse) {
      matchedResources.push({
        skill: skill,
        levels: matchedCourse.levels
      });
    } else {
      console.log(`ℹ️ No curated resources found for missing skill: "${skill}"`);
    }
  }

  const result = { resources: matchedResources };

  // 6️⃣ Save to DB
  analysis.resources = result;
  await analysis.save();

  console.log("✅ Cached matched resources in DB");
  res.json(result);
});

module.exports = resourceController;