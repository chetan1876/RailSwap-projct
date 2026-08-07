const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    OTP_LENGTH,
} = require("./auth.constants");

/* =====================================================
                GENERATE OTP
===================================================== */

const generateOTP = () => {

    const min = Math.pow(10, OTP_LENGTH - 1);
    const max = Math.pow(10, OTP_LENGTH) - 1;

    return Math.floor(
        min + Math.random() * (max - min + 1)
    ).toString();

};

/* =====================================================
            GENERATE ACCESS TOKEN
===================================================== */

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            uid: user.uid,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );

};

/* =====================================================
            GENERATE REFRESH TOKEN
===================================================== */

const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            uid: user.uid,
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
    );

};

/* =====================================================
            VERIFY ACCESS TOKEN
===================================================== */

const verifyAccessToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );

};

/* =====================================================
            VERIFY REFRESH TOKEN
===================================================== */

const verifyRefreshToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );

};

/* =====================================================
            GENERATE RANDOM TOKEN
===================================================== */

const generateRandomToken = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");

};

/* =====================================================
        OTP EXPIRY TIME (10 Minutes)
===================================================== */

const getOTPExpiry = () => {

    return Date.now() + (10 * 60 * 1000);

};

/* =====================================================
    PASSWORD RESET TOKEN EXPIRY (15 Minutes)
===================================================== */

const getResetTokenExpiry = () => {

    return Date.now() + (15 * 60 * 1000);

};

/* =====================================================
        ACCOUNT LOCK TIME (15 Minutes)
===================================================== */

const getAccountLockExpiry = () => {

    return Date.now() + (15 * 60 * 1000);

};

/* =====================================================
            CURRENT DATE
===================================================== */

const getCurrentDate = () => {

    return new Date();

};

/* =====================================================
            EXPORTS
===================================================== */

module.exports = {

    generateOTP,

    generateAccessToken,

    generateRefreshToken,

    verifyAccessToken,

    verifyRefreshToken,

    generateRandomToken,

    getOTPExpiry,

    getResetTokenExpiry,

    getAccountLockExpiry,

    getCurrentDate,

};