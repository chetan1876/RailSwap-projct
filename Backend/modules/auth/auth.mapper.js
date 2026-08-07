/*
========================================
REGISTER PAYLOAD MAPPER
========================================
*/

const mapRegisterPayload = (payload) => {
  return {
    fullName: payload.fullName?.trim(),

    email: payload.email
      ?.trim()
      .toLowerCase(),

    phoneNumber: payload.phoneNumber
      ?.trim(),

    password: payload.password,

    gender: payload.gender || "OTHER",
  };
};

/*
========================================
LOGIN PAYLOAD MAPPER
========================================
*/

const mapLoginPayload = (payload) => {
  return {
    email: payload.email
      ?.trim()
      .toLowerCase(),

    password: payload.password,
  };
};

/*
========================================
VERIFY OTP PAYLOAD MAPPER
========================================
*/

const mapVerifyOtpPayload = (
  payload
) => {
  return {
    email: payload.email
      ?.trim()
      .toLowerCase(),

    otp: payload.otp?.trim(),
  };
};

/*
========================================
FORGOT PASSWORD PAYLOAD MAPPER
========================================
*/

const mapForgotPasswordPayload =
  (payload) => {
    return {
      email: payload.email
        ?.trim()
        .toLowerCase(),
    };
  };

/*
========================================
RESET PASSWORD PAYLOAD MAPPER
========================================
*/

const mapResetPasswordPayload =
  (payload) => {
    return {
      token: payload.token,

      newPassword:
        payload.newPassword,
    };
  };

/*
========================================
REFRESH TOKEN PAYLOAD MAPPER
========================================
*/

const mapRefreshTokenPayload =
  (payload) => {
    return {
      refreshToken:
        payload.refreshToken,
    };
  };

module.exports = {
  mapRegisterPayload,
  mapLoginPayload,
  mapVerifyOtpPayload,
  mapForgotPasswordPayload,
  mapResetPasswordPayload,
  mapRefreshTokenPayload,
};