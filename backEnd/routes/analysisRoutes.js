// const express = require("express");
// const router = express.Router();

// const { getAnalysisHistory } = require("../controllers/analysisController");

// // GET /analysis
// router.get("/analysis", getAnalysisHistory);

// module.exports = router;


const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const protect = require("../middleware/authMiddleware");

// GET /analysis - Get all analyses for the logged-in user
router.get("/analysis", protect, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /analysis/:id - Get a single analysis by ID
router.get("/analysis/:id", protect, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized access to this analysis" });
        }
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /analysis/:id - Delete an analysis by ID
router.delete("/analysis/:id", protect, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized access to this analysis" });
        }
        await Analysis.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Analysis deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ POST route
router.post("/analysis", async (req, res) => {
    try {
        console.log("HIT /api/analysis"); // 👈 debug

        const data = await Analysis.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;