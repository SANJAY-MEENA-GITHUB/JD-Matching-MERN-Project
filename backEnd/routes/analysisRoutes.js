// const express = require("express");
// const router = express.Router();

// const { getAnalysisHistory } = require("../controllers/analysisController");

// // GET /analysis
// router.get("/analysis", getAnalysisHistory);

// module.exports = router;


const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");

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