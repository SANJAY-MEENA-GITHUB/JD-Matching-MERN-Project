const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, resourceController);

module.exports = router;