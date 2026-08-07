/**
 * Register Response DTO
 */
const registerDTO = (user) => {
    return {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
    };
};

/**
 * Login Response DTO
 */
const loginDTO = (user, accessToken, refreshToken) => {
    return {
        user: {
            uid: user.uid,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            profileImage: user.profileImage || null,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

/**
 * User Profile DTO
 */
const profileDTO = (user) => {
    return {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        profileImage: user.profileImage || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin || null,
    };
};

module.exports = {
    registerDTO,
    loginDTO,
    profileDTO,
};