const authDocs = {
  tags: [
    {
      name: "Authentication",
      description:
        "Authentication and authorization related APIs",
    },
  ],

  endpoints: {
    register: {
      method: "POST",

      path: "/api/auth/register",

      summary:
        "Register a new user",

      authentication: false,

      requestBody: {
        fullName: "string",
        email: "string",
        phoneNumber: "string",
        password: "string",
        gender:
          "MALE | FEMALE | OTHER",
      },

      responses: {
        201:
          "User registered successfully",
        400:
          "Validation failed",
        409:
          "User already exists",
      },
    },

    login: {
      method: "POST",

      path: "/api/auth/login",

      summary:
        "Login user and generate tokens",

      authentication: false,

      requestBody: {
        email: "string",
        password: "string",
      },

      responses: {
        200:
          "Login successful",
        401:
          "Invalid credentials",
        403:
          "Account not verified",
      },
    },

    verifyOtp: {
      method: "POST",

      path: "/api/auth/verify-otp",

      summary:
        "Verify account using OTP",

      authentication: false,

      requestBody: {
        email: "string",
        otp: "string",
      },

      responses: {
        200:
          "OTP verified successfully",
        400:
          "Invalid OTP",
        410:
          "OTP expired",
      },
    },

    forgotPassword: {
      method: "POST",

      path:
        "/api/auth/forgot-password",

      summary:
        "Send password reset link",

      authentication: false,

      requestBody: {
        email: "string",
      },

      responses: {
        200:
          "Password reset email sent",
        404:
          "User not found",
      },
    },

    resetPassword: {
      method: "POST",

      path:
        "/api/auth/reset-password",

      summary:
        "Reset account password",

      authentication: false,

      requestBody: {
        token: "string",
        newPassword:
          "string",
      },

      responses: {
        200:
          "Password reset successful",
        400:
          "Invalid token",
        410:
          "Reset token expired",
      },
    },

    logout: {
      method: "POST",

      path: "/api/auth/logout",

      summary:
        "Logout current user",

      authentication: true,

      responses: {
        200:
          "Logout successful",
        401:
          "Unauthorized",
      },
    },

    refreshToken: {
      method: "POST",

      path:
        "/api/auth/refresh-token",

      summary:
        "Generate new access token using refresh token",

      authentication: false,

      requestBody: {
        refreshToken:
          "string",
      },

      responses: {
        200:
          "Token refreshed successfully",
        401:
          "Invalid refresh token",
      },
    },
  },
};

module.exports = authDocs;