const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const analyzeRoute = require("./routes/analyze");
const authRoutes = require("./routes/authRoutes");
const preparationRoutes = require("./routes/preparationRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const technicalQuesRoutes = require("./routes/technicalQuesRoutes");
const behavioralQuesRoutes = require("./routes/behavioralQuesRoutes");

const ApiError = require("./utils/ApiError");
const errorMiddleware = require("./middleware/errorMiddleware");

// const analyzeController = require("./controllers/analyzeController");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//dotenv is loaded
dotenv.config();

// 🔥 CONNECT DATABASE
connectDB();

const app = express();

// console.log("MONGO_URI:", process.env.MONGO_URI);

// middleware
app.use(cookieParser());

// app.use(cors());
app.use(cors({
    origin: "http://localhost:5173",    //vite
    credentials: true
}));

app.use(express.json());


// routes

app.use("/api/auth", authRoutes);

app.use("/analyze", analyzeRoute);

app.get("/", (req, res) => {
    res.send("Analyze API is running 🚀");
});

// data base routes
const analysisRoutes = require("./routes/analysisRoutes");
app.use("/api", analysisRoutes);


//preparation-plan routes   
app.use("/api/preparation-plan", preparationRoutes);

//resources routes  
app.use("/api/resources", resourceRoutes);


//technical-questions routes 
app.use("/api/technicalQues", technicalQuesRoutes);

//behavioral-question routes
app.use("/api/behavioralQues", behavioralQuesRoutes);



//to handle all unknown Routes
app.use((req, res, next) => {
    next(new ApiError(
        404,
        "Route not found"
    ));
});


//error middleware-- always at last
app.use(errorMiddleware);

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
