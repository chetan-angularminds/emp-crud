import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Register callback function
const register = asyncHandler(async (req, res) => {
    const newUser = new User({ ...req.body, role: "admin" });
    await newUser.save();

    res.status(201).json({ status: "success", message: "User registered successfully" });
});

// Login callback function
const login = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }
    const token = user.generateAccessToken();
    res.status(200).json({ status: "success",message: "login success", token });
});

const authController = {
    register,
    login,
};
export default authController;
