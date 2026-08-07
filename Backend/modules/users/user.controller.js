const userRepository = require("./user.repository");

/*
====================================
GET PROFILE
GET /api/users/profile
====================================
*/

const getProfile = async (req, res) => {
  try {
    const user = await userRepository.findUserById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
UPDATE PROFILE
PUT /api/users/profile
====================================
*/

const updateProfile = async (
  req,
  res
) => {
  try {
    const allowedUpdates = [
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

    allowedUpdates.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          updates[field] =
            req.body[field];
        }
      }
    );

    const user =
      await userRepository.updateUserById(
        req.user.id,
        updates
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
====================================
DELETE ACCOUNT
DELETE /api/users/profile
====================================
*/

const deleteProfile =
  async (req, res) => {
    try {
      const user =
        await userRepository.deleteUserById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
====================================
GET USER BY ID
(Admin API)
====================================
*/

const getUserById =
  async (req, res) => {
    try {
      const user =
        await userRepository.findUserById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
====================================
UPDATE USER STATUS
(Admin API)
====================================
*/

const updateUserStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const user =
        await userRepository.updateUserById(
          req.params.id,
          {
            status,
          }
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "User status updated successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserById,
  updateUserStatus,
};