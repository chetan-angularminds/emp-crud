export class ApiResponse {
    constructor(statuscode, data, message = "success", redirect=null) {
        this.statusCode = statuscode;
        this.data = data;
        this.message = message;
        this.success = statuscode < 400;
        this.redirect = redirect
    }
}
