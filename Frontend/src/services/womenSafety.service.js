import axios from "axios";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_BASE_URL = `${API_URL}/api/women-safety`;

/* =====================================================
   AUTH HEADERS
===================================================== */

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

/* =====================================================
   WOMEN SAFETY API
===================================================== */

export const womenSafetyAPI = {
  // Dashboard
  getDashboard: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/dashboard`,
      getHeaders(token)
    );
    return response.data;
  },

  // Refresh Dashboard
  refreshDashboard: async (userId, token) => {
    const response = await axios.patch(
      `${API_BASE_URL}/${userId}/dashboard/refresh`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  // Safety Score
  getSafetyScore: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/safety-score`,
      getHeaders(token)
    );
    return response.data;
  },

  // Safe Seats
  getSafeSeats: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/safe-seats`,
      getHeaders(token)
    );
    return response.data;
  },

  // Journey Companions
  getCompanions: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/companions`,
      getHeaders(token)
    );
    return response.data;
  },

  // Connect Companion
  connectCompanion: async (userId, data, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/${userId}/companions/connect`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // Raise SOS
  raiseSOS: async (userId, data, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/${userId}/sos`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // Contact RPF
  contactRPF: async (userId, data, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/${userId}/rpf`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // Contact Helpline
  contactHelpline: async (userId, data, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/${userId}/helpline`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // AI Insight
  getInsight: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/insight`,
      getHeaders(token)
    );
    return response.data;
  },
};

export default womenSafetyAPI;