const jwt = require("jsonwebtoken");

/**
 * Generate Access Token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(
        {
            uid: payload.uid,
            email: payload.email,
            role: payload.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES,
        }
    );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(
        {
            uid: payload.uid,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES,
        }
    );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};

/**
 * Decode Token (Without Verification)
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken,
};