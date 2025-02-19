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

    if (!user) {
        throw new ApiError(401, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials");
    }
    if (user.deleted) {
        throw new ApiError(403, "User is deleted");
    }
    if (!user.status) {
        throw new ApiError(403, "User is inactive");
    }
    const token = user.generateAccessToken();

    const response = new ApiResponse(200, { token }, "Login success");

    res.status(200).json(response);
});
// Change password callback function
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    const response = new ApiResponse(200, null, "Password changed successfully");
    res.status(200).json(response);
});

const authController = {
    register,
    login,
    changePassword,
};

export default authController;
