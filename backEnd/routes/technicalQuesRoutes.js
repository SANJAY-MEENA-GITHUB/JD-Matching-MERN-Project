const express = require("express");
const router = express.Router();

const technicalQuesController = require("../controllers/technicalQuesController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, technicalQuesController);

module.exports = router;