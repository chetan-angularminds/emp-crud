import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Organization } from "../models/organization.model.js";

// Get all employees with pagination, search, and sorting
const getAllEmployees = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "asc",
    } = req.query;
    if(!req.user.org){
        throw new ApiError(400, "User does not belongs to an Organization", '/organisation');
    }
    const query = {
        org: req.user.org._id,
        deleted: { $ne: true },
        $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
        ],
    };

    const sortOrder = order === "asc" ? 1 : -1;

    const employees = await User.find(query)
        .select("-password") // Exclude the password field
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalEmployees = await User.countDocuments(query);
    
    const response = new ApiResponse(
        200,
        {
            employees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: parseInt(page),
        }
    );

    res.status(200).json(response);
});

// Get a single employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id).populate("org");
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    const response = new ApiResponse(200, employee);

    res.status(200).json(response);
});

// Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
    console.log(req.user);
    
    if (!req.user.role === "admin") {
        throw new ApiError(403, "Forbidden: Only admins can create employees");
    }
    const employee = new User({
        ...req.body,
        createdBy: req.user._id,
        org: req.user.org,
    });
    const newEmployee = await employee.save();
    const response = new ApiResponse(201, null, "Employee created successfully");
    res.status(201).json(response);
});

// Update an existing employee
const updateEmployee = asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    if (!req.user.role === "admin" && req.user._id.toString() !== employee._id.toString()) {
        throw new ApiError(403, "Forbidden: Only admins or the user himself can update employee details");
    }
    Object.assign(employee, req.body);
    employee.updatedBy = req.user._id;
    await employee.save();
    const response = new ApiResponse(200, null, "Employee updated successfully");
    res.status(200).json(response);
});

// Delete an employee
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id).populate("org");
    console.log(req.user.role);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    if (employee.org.createdBy.toString() === employee._id.toString()) {
        if (req.user._id.toString() !== employee._id.toString()) {
            throw new ApiError(403, "Forbidden: Only the creator of the organization can delete himself");
        }
        // Set the organization and all its referenced users to deleted
        const org = await Organization.findById(employee.org._id);
        org.deleted = true;
        await org.save();
        await User.updateMany({ org: employee.org._id }, { deleted: true });
        const response = new ApiResponse(204, null, "Owner and organization deleted successfully");
        return res.status(204).json(response);
    } else if (!req.user.role === "admin") {
        throw new ApiError(403, "Forbidden: Only admins can delete employees");
    }
    employee.deleted = true;
    await employee.save();

    const response = new ApiResponse(204, null, "Employee deleted successfully");
    res.status(201).json(response);
});

// Change password callback function
const changePassword = asyncHandler(async (req, res) => {
    const { newPassword} = req.body;
    const employeeId = req.params.id;
    if (!employeeId) {
        throw new ApiError(400, "Employee ID is required");
    }
    if (!!req.user.role === "admin" && req.user._id.toString() !== employeeId) {
        throw new ApiError(403, "Forbidden: Only admins or the user himself can change password");
    }

    const user = await User.findById(employeeId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }


    user.password = newPassword;
    await user.save();

    const response = new ApiResponse(200, null, "Password changed successfully");
    res.status(200).json(response);
});

const employeeController = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    changePassword
};

export default employeeController;
