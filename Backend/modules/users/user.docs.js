const userDocs = {
  tags: [
    {
      name: "Users",
      description:
        "User profile and account management APIs",
    },
  ],

  endpoints: {
    getProfile: {
      method: "GET",
      path: "/api/users/profile",
      summary:
        "Get logged in user profile",
      authentication: true,
      roles: [
        "USER",
        "ADMIN",
        "MODERATOR",
        "SUPER_ADMIN",
      ],

      responses: {
        200: "Profile fetched successfully",
        401: "Unauthorized",
        404: "User not found",
      },
    },

    updateProfile: {
      method: "PUT",
      path: "/api/users/profile",
      summary:
        "Update logged in user profile",
      authentication: true,

      requestBody: {
        fullName: "string",
        phoneNumber: "string",
        gender: "string",
        age: "number",
        city: "string",
        state: "string",
        profileImage: "string",
      },

      responses: {
        200: "Profile updated successfully",
        400: "Validation error",
        401: "Unauthorized",
      },
    },

    deleteProfile: {
      method: "DELETE",
      path: "/api/users/profile",
      summary:
        "Delete logged in user account",
      authentication: true,

      responses: {
        200: "Account deleted successfully",
        401: "Unauthorized",
      },
    },

    getUserById: {
      method: "GET",
      path: "/api/users/:id",
      summary:
        "Get user details by id",

      authentication: true,

      roles: [
        "ADMIN",
        "SUPER_ADMIN",
      ],

      responses: {
        200: "User found",
        403: "Forbidden",
        404: "User not found",
      },
    },

    updateUserStatus: {
      method: "PATCH",
      path: "/api/users/:id/status",

      summary:
        "Update user status",

      authentication: true,

      roles: [
        "ADMIN",
        "SUPER_ADMIN",
      ],

      requestBody: {
        status:
          "ACTIVE | BLOCKED | SUSPENDED | PENDING_VERIFICATION",
      },

      responses: {
        200: "User status updated",
        403: "Forbidden",
        404: "User not found",
      },
    },
  },
};

module.exports = userDocs;