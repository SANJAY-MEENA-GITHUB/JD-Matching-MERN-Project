const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        matchPercentage: {
            type: Number,
            required: true
        },

        matchingSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        improvements: {
            type: [String],
            default: []
        },
        jobRole: {
            type: String
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        preparationPlan: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        resources: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        technicalQuestions: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        behavioralQuestions: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Analysis", analysisSchema);



// const mongoose = require("mongoose");

// const analysisSchema = new mongoose.Schema({
//     matchPercentage: Number,
//     matchingSkills: [String],
//     missingSkills: [String],
//     improvements: [String],

//     // optional
//     // resumeText: String,
//     // jdText: String,

// }, { timestamps: true });

// module.exports = mongoose.model("Analysis", analysisSchema);





// const mongoose = require("mongoose");

// const analysisSchema = new mongoose.Schema({

//   matchPercentage: Number,

//   matchingSkills: [String],

//   missingSkills: [String],

//   improvements: [String],

//   resources: [
//     {
//       skill: String,
//       youtube: [String],
//       articles: [String],
//       docs: [String]
//     }
//   ],

//   technicalQuestions: [
//     {
//       question: String,
//       intention: String,
//       answer: String
//     }
//   ],

//   behavioralQuestions: [
//     {
//       question: String,
//       intention: String,
//       answer: String
//     }
//   ],

//   skillGaps: [
//     {
//       skill: String,
//       severity: {
//         type: String,
//         enum: ["low", "medium", "high"]
//       }
//     }
//   ],

//   preparationPlan: [
//     {
//       day: Number,
//       focus: String,
//       tasks: [String]
//     }
//   ]

// }, { timestamps: true });

// module.exports = mongoose.model("Analysis", analysisSchema);