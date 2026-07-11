const express = require("express");
const router = express.Router();

const behavioralQuesController = require("../controllers/behavioralQuesController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, behavioralQuesController);

module.exports = router;

