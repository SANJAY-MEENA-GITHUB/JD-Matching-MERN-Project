const express = require("express");
const router = express.Router();

const preparationController = require("../controllers/preparationController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, preparationController);

module.exports = router;