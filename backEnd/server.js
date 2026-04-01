const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");
// const analyzeController = require("./controllers/analyzeController");
const dotenv =  require("dotenv");
const connectDB= require("./config/db");

//dotenv is loaded
dotenv.config();

// 🔥 CONNECT DATABASE
connectDB();

const app = express();

// console.log("MONGO_URI:", process.env.MONGO_URI);

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/analyze", analyzeRoute);

app.get("/", (req, res) => {
    res.send("Analyze API is running 🚀");
});

// data base routes
const analysisRoutes = require("./routes/analysisRoutes");
app.use("/api", analysisRoutes);




// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
