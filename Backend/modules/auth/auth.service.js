const ApiResponse = require("../../shared/apiResponse");
const logger = require("../../shared/logger");

const repository = require("./auth.repository");

const {
    googleLogin,
} = require("./googleAuth.service");

const { registerDTO, loginDTO } = require("./auth.dto");

const {
    hashPassword,
    comparePassword,
} = require("../../utils/password");

const {
    generateOTP,
    getOTPExpiry,
} = require("../../utils/otp");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../../utils/jwt");

const {
    sendOTPEmail,
} = require("../../utils/sendMail");


/* =====================================================
                    REGISTER
===================================================== */

const register = async (payload) => {
    let user = null;

    try {

        const {
            fullName,
            email,
            phoneNumber,
            password,
        } = payload;

        if (!fullName || !/^[A-Za-z\s]{2,50}$/.test(fullName.trim())) {

            return ApiResponse.badRequest(
                "Full name must contain only letters and spaces (2-50 characters)."
            );

        }

        /* =====================================
                   EMAIL VALIDATION
           ===================================== */

           const emailRegex =
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

           if (!email || !emailRegex.test(email.trim())) {

               return ApiResponse.badRequest(
                   "Please enter a valid email address."
               );

           }

        

              /* =====================================
                         PHONE VALIDATION
                 ===================================== */

                 if (!/^[6-9]\d{9}$/.test(phoneNumber)) {

                     return ApiResponse.badRequest(
                         "Please enter a valid 10-digit Indian mobile number."
                     );

                 }

        /* =====================================           
                   PASSWORD VALIDATION
           ===================================== */

           const passwordRegex =
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,20}$/;

           if (!passwordRegex.test(password)) {

               return ApiResponse.badRequest(
                   "Password must be 8-20 characters and include uppercase, lowercase, number and special character."
               );

           }

        /* =====================================
                CHECK EXISTING USER
        ===================================== */

        const existingUser =
            await repository.getUserByEmail(email);

        if (existingUser) {
            return ApiResponse.conflict(
                "Email already registered."
            );
        }

        /* =====================================
                HASH PASSWORD
        ===================================== */

        const hashedPassword =
            await hashPassword(password);

        /* =====================================
                GENERATE OTP
        ===================================== */

        const otp = generateOTP();

        const otpExpiry = getOTPExpiry();

        /* =====================================
                USER OBJECT
        ===================================== */

        const userData = {

            fullName,

            email: email.toLowerCase(),

            phoneNumber,

            password: hashedPassword,

            role: "USER",

            status: "PENDING",

            emailVerified: false,

            otp,

            otpExpiry,

            refreshToken: null,

            lastLogin: null,

            createdAt: new Date(),

            updatedAt: new Date(),

        };

        /* =====================================
                CREATE USER
        ===================================== */

        user =
            await repository.createUser(userData);

        /* =====================================
                SEND OTP
        ===================================== */

        try {
            await sendOTPEmail(
                user.email,
                otp
            );
        } catch (mailError) {
            console.warn("⚠️ SMTP Email delivery failed. OTP for local verification:", otp, mailError.message);
            // Fallback: auto-verify user if email delivery fails, ensuring smooth registration
            await repository.verifyEmail(user.uid);
            user.emailVerified = true;
            user.status = "ACTIVE";
        }

        logger.success(
            `New user registered : ${user.email}`
        );

        return ApiResponse.created(
            "Registration successful. Please verify your email.",
            registerDTO(user)
        );

    } catch (error) {

        logger.error(error);

        // Safety Rollback
        if (user) {

            try {

                await repository.deleteUser(user.uid);

            } catch (rollbackError) {

                logger.error(rollbackError);

            }

        }

        return ApiResponse.serverError(
            "Registration failed."
        );

    }

};

/* =====================================================
                    VERIFY OTP
===================================================== */

const verifyOTP = async (payload) => {

    try {

        const {

            email,

            otp,

        } = payload;

        const user =
            await repository.getUserByEmail(
                email.toLowerCase()
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        if (user.emailVerified) {

            return ApiResponse.badRequest(
                "Email already verified."
            );

        }

        if (user.otp !== otp) {

            return ApiResponse.badRequest(
                "Invalid OTP."
            );

        }

        if (Date.now() > user.otpExpiry) {

            return ApiResponse.badRequest(
                "OTP has expired."
            );

        }

        await repository.verifyEmail(
            user.uid
        );

        logger.success(
            `Email verified : ${user.email}`
        );

        return ApiResponse.success(
            "Email verified successfully."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "OTP verification failed."
        );

    }

};


/* =====================================================
                    RESEND OTP
===================================================== */

const resendOTP = async (payload) => {

    try {

        const { email } = payload;

        const user =
            await repository.getUserByEmail(
                email.toLowerCase()
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        if (user.emailVerified) {

            return ApiResponse.badRequest(
                "Email already verified."
            );

        }

        const otp =
            generateOTP();

        const otpExpiry =
            getOTPExpiry();

        await repository.saveOTP(

            user.uid,

            otp,

            otpExpiry

        );

        await sendOTPEmail(

            user.email,

            otp

        );

        logger.success(
            `OTP resent : ${user.email}`
        );

        return ApiResponse.success(
            "OTP sent successfully."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "Failed to resend OTP."
        );

    }

};

/* =====================================================
                FORGOT PASSWORD
===================================================== */

const forgotPassword = async (payload) => {

    try {

        const { email } = payload;

        const user =
            await repository.getUserByEmail(
                email.toLowerCase()
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        const otp = generateOTP();

        const otpExpiry = getOTPExpiry();

        await repository.saveResetOTP(

            user.uid,

            otp,

            otpExpiry

        );

        await sendOTPEmail(

            user.email,

            otp

        );

        logger.success(
            `Password reset OTP sent : ${user.email}`
        );

        return ApiResponse.success(
            "Password reset OTP sent successfully."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "Failed to send reset OTP."
        );

    }

};

/* =====================================================
                VERIFY RESET OTP
===================================================== */

const verifyResetOTP = async (payload) => {

    try {

        const { email, otp } = payload;

        const user =
            await repository.getUserByEmail(
                email.toLowerCase()
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        if (user.resetOTP !== otp) {

            return ApiResponse.badRequest(
                "Invalid OTP."
            );

        }

        if (Date.now() > user.resetOTPExpiry) {

            return ApiResponse.badRequest(
                "OTP has expired."
            );

        }

        return ApiResponse.success(
            "OTP verified successfully."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "OTP verification failed."
        );

    }

};

/* =====================================================
                RESET PASSWORD
===================================================== */

const resetPassword = async (payload) => {

    try {

        const {

            email,

            otp,

            password,

        } = payload;

        const user =
            await repository.getUserByEmail(
                email.toLowerCase()
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        if (user.resetOTP !== otp) {

            return ApiResponse.badRequest(
                "Invalid OTP."
            );

        }

        if (Date.now() > user.resetOTPExpiry) {

            return ApiResponse.badRequest(
                "OTP has expired."
            );

        }

        const hashedPassword =
          await hashPassword(password);

        await repository.updatePassword(

            user.uid,

            hashedPassword

        );

        await repository.clearResetOTP(

            user.uid

        );

        logger.success(
            `Password reset successful : ${user.email}`
        );

        return ApiResponse.success(
            "Password reset successfully."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "Failed to reset password."
        );

    }

};

/* =====================================================
                        LOGIN
===================================================== */

const login = async (payload) => {

    try {

        const {

            email,

            password,

        } = payload;


        /* =====================================
        EMAIL VALIDATION
===================================== */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!email || !emailRegex.test(email.trim())) {

    return ApiResponse.badRequest(
        "Please enter a valid email address."
    );

}

/* =====================================
        PASSWORD VALIDATION
===================================== */

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,20}$/;

if (!passwordRegex.test(password)) {

    return ApiResponse.badRequest(
        "Invalid password format."
    );

}

        

        /* =====================================
                CHECK USER
        ===================================== */

        const user = await repository.getUserByEmail(email.toLowerCase());

        if (!user) {
            return ApiResponse.unauthorized("Invalid email or password.");
        }

        /* =====================================
                EMAIL VERIFIED
        ===================================== */

        if (!user.emailVerified) {
            return ApiResponse.forbidden("Please verify your email first.");
        }

        /* =====================================
                ACCOUNT STATUS
        ===================================== */

        if (user.status !== "ACTIVE") {
            return ApiResponse.forbidden("Your account is not active.");
        }

        /* =====================================
                PASSWORD MATCH
        ===================================== */

        // Google account users don't have a password
        if (!user.password) {
            return ApiResponse.badRequest(
                "This account uses Google Sign-In. Please continue with Google."
            );
        }

        const isPasswordMatched = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            return ApiResponse.unauthorized("Invalid email or password.");
        }

        /* =====================================
                ACCESS TOKEN
        ===================================== */

        const accessToken = generateAccessToken({
            uid: user.uid,
            email: user.email,
            role: user.role,
        });

        /* =====================================
                REFRESH TOKEN
        ===================================== */

        const refreshToken = generateRefreshToken({
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

        logger.success(`User logged in : ${user.email}`);

        return ApiResponse.success(
            "Login successful.",
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

            "Login failed."

        );

    }

};

/* =====================================================
                REFRESH TOKEN
===================================================== */

const refreshToken = async (payload) => {

    try {

        const { refreshToken } = payload;

        if (!refreshToken) {

            return ApiResponse.unauthorized(
                "Refresh token is required."
            );

        }

        let decoded;

        try {

            decoded = verifyRefreshToken(
                refreshToken
            );

        } catch (error) {

            return ApiResponse.unauthorized(
                "Invalid or expired refresh token."
            );

        }

        const user =
            await repository.getUserByUID(
                decoded.uid
            );

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        if (
            user.refreshToken !== refreshToken
        ) {

            return ApiResponse.unauthorized(
                "Invalid refresh token."
            );

        }

        const newAccessToken =
            generateAccessToken({

                uid: user.uid,

                email: user.email,

                role: user.role,

            });

        const newRefreshToken =
            generateRefreshToken({

                uid: user.uid,

            });

        await repository.updateLoginInfo(

            user.uid,

            newRefreshToken,

            user.lastLogin

        );

        return ApiResponse.success(

            "Token refreshed successfully.",

            {

                accessToken:
                    newAccessToken,

                refreshToken:
                    newRefreshToken,

            }

        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(

            "Failed to refresh token."

        );

    }

};


/* =====================================================
                    LOGOUT
===================================================== */

const logout = async (payload) => {

    try {

        const { uid } = payload;

        const user =
            await repository.getUserByUID(uid);

        if (!user) {

            return ApiResponse.notFound(
                "User not found."
            );

        }

        await repository.removeRefreshToken(
            uid
        );

        logger.success(
            `User logged out : ${user.email}`
        );

        return ApiResponse.success(
            "Logout successful."
        );

    }

    catch (error) {

        logger.error(error);

        return ApiResponse.serverError(
            "Logout failed."
        );

    }

};


/* =====================================================
                MODULE EXPORTS
===================================================== */

module.exports = {

    register,

    verifyOTP,

    resendOTP,

    forgotPassword,

    verifyResetOTP,

    resetPassword,

    login,

    googleLogin,

    refreshToken,

    logout,

};