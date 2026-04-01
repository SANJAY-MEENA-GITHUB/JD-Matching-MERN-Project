const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    matchPercentage: Number,
    matchingSkills: [String],
    missingSkills: [String],
    improvements: [String],

    // optional
    // resumeText: String,
    // jdText: String,

}, { timestamps: true });

module.exports = mongoose.model("Analysis", analysisSchema);