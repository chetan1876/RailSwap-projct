const authService = require("./auth.service");

/* =====================================================
                    REGISTER
===================================================== */

const register = async (req, res, next) => {
  try {
    const response = await authService.register(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                    VERIFY OTP
===================================================== */

const verifyOTP = async (req, res, next) => {
  try {
    const response = await authService.verifyOTP(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                    RESEND OTP
===================================================== */

const resendOTP = async (req, res, next) => {
  try {
    const response = await authService.resendOTP(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                FORGOT PASSWORD
===================================================== */

const forgotPassword = async (req, res, next) => {
  try {
    const response = await authService.forgotPassword(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                VERIFY RESET OTP
===================================================== */

const verifyResetOTP = async (req, res, next) => {
  try {
    const response = await authService.verifyResetOTP(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                RESET PASSWORD
===================================================== */

const resetPassword = async (req, res, next) => {
  try {
    const response = await authService.resetPassword(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                        LOGIN
===================================================== */

const login = async (req, res, next) => {
  try {
    const response = await authService.login(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                    GOOGLE LOGIN
===================================================== */

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const response = await authService.googleLogin(idToken);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                REFRESH TOKEN
===================================================== */

const refreshToken = async (req, res, next) => {
  try {
    const response = await authService.refreshToken(req.body);

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
                    LOGOUT
===================================================== */

const logout = async (req, res, next) => {
  try {
    const response = await authService.logout({
      uid: req.user.uid,
    });

    return res
      .status(response.statusCode)
      .json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  login,
  googleLogin,
  refreshToken,
  logout,
};