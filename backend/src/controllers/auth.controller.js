import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Register callback function
const register = asyncHandler(async (req, res) => {
    const newUser = new User({ ...req.body, role: "admin" });
    await newUser.save();
    const response = new ApiResponse(201, null, "User registered successfully");
    res.status(201).json(response);
});

// Login callback function
const login = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateAccessToken();

    const response = new ApiResponse(200, { token }, "Login success");

    res.status(200).json(response);
});

const authController = {
    register,
    login,
};
export default authController;
