import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import {User} from "../models/user.model.js"; // Adjust the import based on your project structure
import asyncHandler from "./../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Access token is missing or invalid");
    }
    let decoded;

    try {
        decoded = jwt.verify(token, config.jwt.secret);
        
    } catch (err) {
        throw new ApiError(403, "Invalid token");
    }
    const user = await User.findById(decoded.id).select("-password").populate('org'); // Assuming the token contains the user ID

        if (!user) {
            throw new ApiError(404, "User not found");
        } else if (!user.status) {
            throw new ApiError(403, "User is inactive");
        } else if (user.deleted) {
            throw new ApiError(403, "User is deleted");
        }

        req.user = user;
        next();
});

export default authMiddleware;
