
const express = require("express");
const multer = require("multer");
const analyzeController = require("../controllers/analyzeController");

const router = express.Router();

// memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// POST /analyze
router.post("/", (req, res, next) => {
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "jdPdf", maxCount: 1 }
    ])(req, res, (err) => {

        // Multer error
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: `Upload error: ${err.message}`
            });
        }

        // Unknown error
        if (err) {
            return res.status(500).json({
                error: "File upload failed"
            });
        }

        // Proceed to controller
        next();
    });
}, analyzeController);

module.exports = router;
