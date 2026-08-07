const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

/**
 * Hash Password
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare Password
 */
const comparePassword = async (
    plainPassword,
    hashedPassword
) => {
    return await bcrypt.compare(
        plainPassword,
        hashedPassword
    );
};

/**
 * Validate Password Strength
 */
const isStrongPassword = (password) => {

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    return passwordRegex.test(password);

};

module.exports = {
    hashPassword,
    comparePassword,
    isStrongPassword,
};