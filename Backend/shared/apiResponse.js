class ApiResponse {
    static success(message = "Success", data = null, statusCode = 200) {
        return {
            success: true,
            statusCode,
            message,
            data,
        };
    }

    static created(message = "Created Successfully", data = null) {
        return {
            success: true,
            statusCode: 201,
            message,
            data,
        };
    }

    static badRequest(message = "Bad Request") {
        return {
            success: false,
            statusCode: 400,
            message,
            data: null,
        };
    }

    static unauthorized(message = "Unauthorized") {
        return {
            success: false,
            statusCode: 401,
            message,
            data: null,
        };
    }

    static forbidden(message = "Forbidden") {
        return {
            success: false,
            statusCode: 403,
            message,
            data: null,
        };
    }

    static notFound(message = "Not Found") {
        return {
            success: false,
            statusCode: 404,
            message,
            data: null,
        };
    }

    static conflict(message = "Conflict") {
        return {
            success: false,
            statusCode: 409,
            message,
            data: null,
        };
    }

    static validationError(errors) {
        return {
            success: false,
            statusCode: 422,
            message: "Validation Error",
            errors,
        };
    }

    static serverError(message = "Internal Server Error") {
        return {
            success: false,
            statusCode: 500,
            message,
            data: null,
        };
    }
}

module.exports = ApiResponse;