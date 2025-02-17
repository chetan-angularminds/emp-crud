import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

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

    res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        organisation: savedOrg,
    });
});

const getOrganisationDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("org");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (!user.org) {
        throw new ApiError(404, "Organisation not found");
    }
    res.status(200).json({ status: "success", organisation: user.org });
});

const orgController = {
    createOrganisation,
    getOrganisationDetails,
};
export default orgController;
