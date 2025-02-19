import { ApiResponse } from "../utils/ApiResponse.js";



const errorResponseGenerator = (err) => { 
    let error = { ...err };
    error.message = err.message;
    let response = new ApiResponse(error.statusCode, null, error.message)
    if (error?.errorResponse?.code === 11000) {
        response = handleDuplicateKeyError(error);
    }
    if (error.name === "ValidationError") {
        error = handleValidationError(error);
    }
    return response;
}

const handleDuplicateKeyError = (err) => {
    const message = `Duplicate field value entered for ${Object.keys(err.errorResponse.keyValue)} `;
    return new ApiResponse(400, null, message);
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new ApiResponse(400, null, message);
}

export const errorHandler = async (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    console.log(error);
    const response = errorResponseGenerator(error);
    res.status(error.statusCode).json(response);
};