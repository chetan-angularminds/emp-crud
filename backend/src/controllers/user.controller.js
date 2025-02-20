import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";

const getUserdetails = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "user not found");
    }

    const response = new ApiResponse(201, req.user);

    return res.status(201).json(response);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(401, "user not found");
    }
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.contactNumber = req.body.contactNumber;
    user.userName = req.body.userName;
    await user.save();
    const response = new ApiResponse(204, "user updated successfully");

    res.status(200).json(response);
});

const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("org");
    console.log(req.user.role);
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    if (user.org.createdBy.toString() === user._id.toString()) {
        // Set the organization and all its referenced users to deleted
        const org = await Organization.findById(user.org._id);
        org.deleted = true;
        await org.save();
        await User.updateMany({ org: user.org._id }, { deleted: true });
        const response = new ApiResponse(204, null, "Owner and organization deleted successfully");
        return res.status(200).json(response);
    } else if (!req.user.role === "admin") {
        throw new ApiError(403, "Forbidden: Only admins can delete users");
    }
    user.deleted = true;
    await user.save();

    const response = new ApiResponse(204, null, "user deleted successfully");
    res.status(201).json(response);
});

const userController = { getUserdetails, updateUser, deleteAccount };
export default userController;
