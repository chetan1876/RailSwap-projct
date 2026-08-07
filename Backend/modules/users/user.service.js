const userRepository =
  require(
    "./user.repository"
  );

/*
========================================
GET USER PROFILE
========================================
*/

const getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/*
========================================
UPDATE USER PROFILE
========================================
*/

const updateProfile = async (
  userId,
  updateData
) => {
  const allowedFields = [
    "fullName",
    "phoneNumber",
    "gender",
    "age",
    "city",
    "state",
    "profileImage",
    "emergencyContact",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  });

  const updatedUser =
    await userRepository.updateUserById(
      userId,
      updates
    );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

/*
========================================
DELETE USER ACCOUNT
========================================
*/

const deleteProfile = async (
  userId
) => {
  const deletedUser =
    await userRepository.deleteUserById(
      userId
    );

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
};

/*
========================================
GET USER BY ID
(Admin Function)
========================================
*/

const getUserById = async (
  userId
) => {
  const user =
    await userRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/*
========================================
UPDATE USER STATUS
(Admin Function)
========================================
*/

const updateUserStatus = async (
  userId,
  status
) => {
  const user =
    await userRepository.updateUserById(
      userId,
      {
        status,
      }
    );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/*
========================================
CHECK USER EXISTS
========================================
*/

const userExists = async (
  email
) => {
  return await userRepository.findUserByEmail(
    email
  );
};

/*
========================================
GET USER BY EMAIL
========================================
*/

const getUserByEmail =
  async (email) => {
    return await userRepository.findUserByEmail(
      email
    );
  };

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserById,
  updateUserStatus,
  userExists,
  getUserByEmail,
};