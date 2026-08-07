import axios from "axios";

/* =====================================================
                    AXIOS INSTANCE
===================================================== */

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* =====================================================
                REQUEST INTERCEPTOR
===================================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
                RESPONSE INTERCEPTOR
===================================================== */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response?.data || error
    );
  }
);

/* =====================================================
                    AUTH API
===================================================== */

export const authAPI = {
  /* ---------------- Register ---------------- */

  register: async (userData) => {
    const response = await API.post(
      "/register",
      userData
    );

    return response.data;
  },

  /* ---------------- Verify OTP ---------------- */

  verifyOtp: async (otpData) => {
    const response = await API.post(
      "/verify-otp",
      otpData
    );

    return response.data;
  },

  /* ---------------- Resend OTP ---------------- */

  resendOtp: async (emailData) => {
    const response = await API.post(
      "/resend-otp",
      emailData
    );

    return response.data;
  },


    /* ---------------- Forgot Password ---------------- */

  forgotPassword: async (emailData) => {
    const response = await API.post(
      "/forgot-password",
      emailData
    );

    return response.data;
  },

  /* ---------------- Verify Reset OTP ---------------- */

  verifyResetOtp: async (otpData) => {
    const response = await API.post(
      "/verify-reset-otp",
      otpData
    );

    return response.data;
  },

  /* ---------------- Reset Password ---------------- */

  resetPassword: async (resetData) => {
    const response = await API.post(
      "/reset-password",
      resetData
    );

    return response.data;
  },

  /* ---------------- Login ---------------- */

  login: async (loginData) => {
    const response = await API.post(
      "/login",
      loginData
    );

    return response.data;
  },

  /* ---------------- Google Login ---------------- */

googleLogin: async (idToken) => {

  const response = await API.post(
    "/google",
    {
      idToken,
    }
  );

  return response.data;

},

  /* ---------------- Refresh Token ---------------- */

  refreshToken: async (refreshToken) => {
    const response = await API.post(
      "/refresh-token",
      {
        refreshToken,
      }
    );

    return response.data;
  },

  /* ---------------- Logout ---------------- */

  logout: async () => {
    const response = await API.post(
      "/logout"
    );

    return response.data;
  },
};

export default API;