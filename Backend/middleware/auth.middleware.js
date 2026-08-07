const ApiResponse = require("../shared/apiResponse");

const {
    verifyAccessToken,
} = require("../utils/jwt");

/* =====================================================
                AUTH MIDDLEWARE
===================================================== */

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res
                .status(401)
                .json(
                    ApiResponse.unauthorized(
                        "Authorization header is required."
                    )
                );

        }

        if (!authHeader.startsWith("Bearer ")) {

            return res
                .status(401)
                .json(
                    ApiResponse.unauthorized(
                        "Invalid authorization format."
                    )
                );

        }

        const token = authHeader.split(" ")[1];

        if (!token) {

            return res
                .status(401)
                .json(
                    ApiResponse.unauthorized(
                        "Access token is required."
                    )
                );

        }

        const decoded =
            verifyAccessToken(token);

        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: decoded.role,
        };

        next();

    }

    catch (error) {

        return res
            .status(401)
            .json(
                ApiResponse.unauthorized(
                    "Invalid or expired access token."
                )
            );

    }

};

module.exports = authMiddleware;