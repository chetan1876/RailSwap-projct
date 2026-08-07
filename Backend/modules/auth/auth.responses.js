/**
 * =====================================================
 *              AUTH RESPONSE HELPERS
 * =====================================================
 */

class AuthResponse {

    /**
     * Success Response
     */
    static success(message, data = null) {

        return {

            success: true,

            statusCode: 200,

            message,

            data,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Created Response
     */
    static created(message, data = null) {

        return {

            success: true,

            statusCode: 201,

            message,

            data,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Bad Request
     */
    static badRequest(message, errors = []) {

        return {

            success: false,

            statusCode: 400,

            message,

            errors,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Unauthorized
     */
    static unauthorized(message) {

        return {

            success: false,

            statusCode: 401,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Forbidden
     */
    static forbidden(message) {

        return {

            success: false,

            statusCode: 403,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Not Found
     */
    static notFound(message) {

        return {

            success: false,

            statusCode: 404,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Conflict
     */
    static conflict(message) {

        return {

            success: false,

            statusCode: 409,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Too Many Requests
     */
    static tooManyRequests(message) {

        return {

            success: false,

            statusCode: 429,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    /**
     * Internal Server Error
     */
    static serverError(message = "Internal Server Error") {

        return {

            success: false,

            statusCode: 500,

            message,

            timestamp: new Date().toISOString(),

        };

    }

    const deleteUser = async (uid) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .delete();

};

}

module.exports = deleteUser, AuthResponse;