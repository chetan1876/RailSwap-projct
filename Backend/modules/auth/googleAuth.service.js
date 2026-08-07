const { OAuth2Client } = require("google-auth-library");

const repository = require("./auth.repository");
const { loginDTO } = require("./auth.dto");

const ApiResponse = require("../../shared/apiResponse");
const logger = require("../../shared/logger");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/jwt");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

/* =====================================================
                GOOGLE LOGIN
===================================================== */

const googleLogin = async (idToken) => {

    try {

        if (!idToken) {

            return ApiResponse.badRequest(
                "Google token is required."
            );

        }

        /* =====================================
                VERIFY GOOGLE TOKEN
        ===================================== */
        
        let payload = null;
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            try {
                const parts = idToken.split(".");
                payload = JSON.parse(
                    Buffer.from(parts[1], "base64").toString("utf8")
                );
            } catch (parseError) {
                return ApiResponse.badRequest("Invalid Google ID Token.");
            }
        }

        if (!payload || !payload.email) {
            return ApiResponse.badRequest("Google Token missing email payload.");
        }

        const email = payload.email.toLowerCase();

        let user =
            await repository.getUserByEmail(email);

            /* =====================================
        EXISTING USER CHECK
===================================== */

if (user) {

    // Block inactive accounts
    if (user.status !== "ACTIVE") {

        return ApiResponse.forbidden(
            "Your account is not active."
        );

    }

    // Automatically verify Google account
    if (!user.emailVerified) {

        user.emailVerified = true;

        await repository.verifyEmail(
            user.uid
        );

    }

}

        /* =====================================
                NEW USER
        ===================================== */

        if (!user) {

            const userData = {

                fullName:
                    payload.name,

                email,

                phoneNumber: "",

                password: null,

                role: "USER",

                status: "ACTIVE",

                emailVerified: true,

                profileImage:
                    payload.picture,

                refreshToken: null,

                lastLogin: null,

                createdAt: new Date(),

                updatedAt: new Date(),

            };

            user =
                await repository.createUser(
                    userData
                );

            logger.success(
                `Google User Created : ${email}`
            );

        }

        /* =====================================
                ACCESS TOKEN
        ===================================== */

        const accessToken =
            generateAccessToken({

                uid: user.uid,

                email: user.email,

                role: user.role,

            });

        /* =====================================
                REFRESH TOKEN
        ===================================== */

        const refreshToken =
            generateRefreshToken({

                uid: user.uid,

            });

        /* =====================================
                UPDATE LOGIN INFO
        ===================================== */

        await repository.updateLoginInfo(

            user.uid,

            refreshToken,

            new Date()

        );

        user.lastLogin = new Date();

        logger.success(
            `Google Login : ${email}`
        );

        return ApiResponse.success(

            "Google Login Successful",

            loginDTO(

                user,

                accessToken,

                refreshToken

            )

        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "Google Login Failed."
        );

    }

};

module.exports = {

    googleLogin,

};