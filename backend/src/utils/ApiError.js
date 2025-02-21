export class ApiError extends Error {
    constructor( statusCode, message,redirect=null) {
        
        super(message);
        this.redirect = redirect
        this.statusCode = statusCode;
        this.status =
            statusCode >= 400 && statusCode < 500 ? "Failed" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
