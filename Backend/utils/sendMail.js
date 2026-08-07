const { transporter } = require("../config/mail");
const logger = require("../shared/logger");

/**
 * Send OTP Email
 */
const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "RailSwap - Email Verification OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                    <h2>Email Verification</h2>

                    <p>Your OTP for verifying your account is:</p>

                    <h1 style="letter-spacing:5px;">${otp}</h1>

                    <p>This OTP is valid for <b>10 minutes</b>.</p>

                    <p>If you didn't request this, please ignore this email.</p>

                    <br>

                    <p>Regards,<br><b>RailSwap Team</b></p>
                </div>
            `,
        });

        logger.success(`OTP email sent to ${email}`);

        return true;
    } catch(error){

    console.log("========== EMAIL ERROR ==========");

    console.log(error);

    console.log(error.response);

    console.log(error.responseCode);

    console.log(error.command);

    logger.error(error);

    throw error;

}
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (email, fullName) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Welcome to RailSwap",
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                    <h2>Welcome ${fullName}</h2>

                    <p>Your account has been verified successfully.</p>

                    <p>Thank you for joining RailSwap.</p>

                    <br>

                    <p>Regards,<br><b>RailSwap Team</b></p>
                </div>
            `,
        });

        logger.success(`Welcome email sent to ${email}`);

        return true;
    } catch (error) {
        logger.error(error);

        throw error;
    }
};

/**
 * Send Password Reset Email
 */
const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                    <h2>Password Reset</h2>

                    <p>Click the button below to reset your password.</p>

                    <a href="${resetLink}"
                        style="
                            display:inline-block;
                            padding:12px 24px;
                            background:#2563eb;
                            color:#fff;
                            text-decoration:none;
                            border-radius:6px;
                        ">
                        Reset Password
                    </a>

                    <p>This link will expire soon.</p>

                    <br>

                    <p>Regards,<br><b>RailSwap Team</b></p>
                </div>
            `,
        });

        logger.success(`Reset password email sent to ${email}`);

        return true;
    } catch (error) {
        logger.error(error);

        throw error;
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendResetPasswordEmail,
};