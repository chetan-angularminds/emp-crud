import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrganisation = asyncHandler(async (req, res) => {
    if (req.user.org) {
        throw new ApiError(400, "User already belongs to an organisation");
    }

    const { name, address, email, phone } = req.body;
    const newOrg = new Organization({ name, address, email, phone, createdBy: req.user._id });
    const savedOrg = await newOrg.save();

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.org = savedOrg._id;
    await user.save();
    const response = new ApiResponse(201, null, "Organisation created successfully");
    res.status(201).json(response);
});

const getOrganisationDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("org");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (!user.org) {
        throw new ApiError(404, "Organisation not found");
    }

    const response = new ApiResponse(200, {organisation: user.org});

    res.status(200).json(response);
});

const updateOrganisation = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (!user.org) {
        throw new ApiError(404, "Organisation not found");
    }
    if (!user.isAdmin) {
        throw new ApiError(403, "You do not have permission to update this organisation");
    }

    const { name, address, email, phone } = req.body;
    const updatedOrg = await Organization.findByIdAndUpdate(
        user.org._id,
        { name, address, email, phone },
        { new: true, runValidators: true }
    );

    const response = new ApiResponse(200, { organisation: updatedOrg }, "Organisation updated successfully");
    res.status(200).json(response);
});

const deleteOrganisation = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("org");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (!user.org) {
        throw new ApiError(404, "Organisation not found");
    }

    if (user._id.toString() !== user.org.createdBy.toString()) {
        throw new ApiError(403, "You do not have permission to delete this organisation");
    }

    await Organization.findByIdAndUpdate(user.org._id, { deleted: true });

    await User.updateMany(
        { org: user.org._id, _id: { $ne: user._id } },
        { deleted: true }
    );

    user.org = null;
    await user.save();

    const response = new ApiResponse(200, null, "Organisation deleted successfully");
    res.status(200).json(response);
});

const orgController = {
    createOrganisation,
    getOrganisationDetails,
    updateOrganisation,
    deleteOrganisation,
    createOrganisation,
};

export default orgController;
