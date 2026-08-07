class ApiError extends Error {
    constructor(
        statusCode = 500,
        message = "Internal Server Error",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    static notFound(message = "Resource Not Found") {
        return new ApiError(404, message);
    }

    static conflict(message = "Resource Already Exists") {
        return new ApiError(409, message);
    }

    static validation(message = "Validation Failed", errors = []) {
        return new ApiError(422, message, errors);
    }

    static internal(message = "Internal Server Error") {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;