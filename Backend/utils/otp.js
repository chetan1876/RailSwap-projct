const crypto = require("crypto");

/**
 * Generate 6 Digit OTP
 */
const generateOTP = () => {

    return crypto.randomInt(100000, 999999).toString();

};

/**
 * OTP Expiry Time (10 Minutes)
 */
const getOTPExpiry = () => {

    return Date.now() + (10 * 60 * 1000);

};

/**
 * Check OTP Expired
 */
const isOTPExpired = (expiryTime) => {

    return Date.now() > expiryTime;

};

/**
 * Generate Email Verification Token
 */
const generateVerificationToken = () => {

    return crypto.randomBytes(32).toString("hex");

};

/**
 * Generate Password Reset Token
 */
const generateResetToken = () => {

    return crypto.randomBytes(32).toString("hex");

};

module.exports = {
    generateOTP,
    getOTPExpiry,
    isOTPExpired,
    generateVerificationToken,
    generateResetToken,
};