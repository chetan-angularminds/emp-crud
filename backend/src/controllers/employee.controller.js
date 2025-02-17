import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";

// Get all employees with pagination, search, and sorting
const getAllEmployees = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "asc",
    } = req.query;

    const query = {
        createdBy: req.user._id,
        deleted: { $ne: true },
        $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
        ],
    };

    const sortOrder = order === "asc" ? 1 : -1;

    const employees = await User.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalEmployees = await User.countDocuments(query);

    res.status(200).json({
        status: "success",
        employees: {
            employees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: parseInt(page),
        },
    });
});

// Get a single employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    res.status(200).json({ status: "success", data: employee });
});

// Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
    const employee = new User({
        ...req.body,
        createdBy: req.user._id,
        org: req.user.org,
    });
    const newEmployee = await employee.save();
    res.status(201).json({
        status: "success",
        message: "Employee created successfully",
    });
});

// Update an existing employee
const updateEmployee = asyncHandler(async (req, res) => {
    const updatedEmployee = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    updateEmployee.updatedBy = req.user._id;
    await updatedEmployee.save();
    if (!updatedEmployee) {
        throw new ApiError(404, "Employee not found");
    }
    res.status(200).json({
        status: "success",
        message: "Employee updated successfully",
    });
});

// Delete an employee
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }
    employee.deleted = true;
    await employee.save();
    res.status(204).json({
        status: "success",
        message: "Employee deleted successfully"
    });
});

const employeeController = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};

export default employeeController;
