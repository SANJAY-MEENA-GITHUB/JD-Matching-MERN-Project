const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError")

// 🔑 Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// 📝 Register
exports.register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    //Duplicate check
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(
            400,
            "Email already exists"
        );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating user in db
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    // Generate JWT
    const token = generateToken(user._id);
    // const token = jwt.sign(
    //     { id: user._id },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "1d" }
    // );

    // Store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

    // res.status(201).json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateToken(user._id)
    // });

});

// 🔐 Login
exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    // res.json({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     token: generateToken(user._id)
    // });

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

});


//logout
exports.logout = asyncHandler(async (req, res) => {
    // res.clearCookie("token");
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
});


// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});