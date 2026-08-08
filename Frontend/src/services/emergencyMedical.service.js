import axios from "axios";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API = `${API_URL}/api/emergency-medical`;

/* =====================================================
   GET AUTH HEADERS
===================================================== */

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

/* =====================================================
   EMERGENCY MEDICAL API
===================================================== */

export const emergencyMedicalAPI = {
  // ================= Dashboard =================

  initializeDashboard: async (userId, token) => {
    const response = await axios.post(
      `${API}/${userId}/dashboard`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  getDashboard: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/dashboard`,
      getHeaders(token)
    );
    return response.data;
  },

  refreshDashboard: async (userId, token) => {
    const response = await axios.patch(
      `${API}/${userId}/dashboard/refresh`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  resetDashboard: async (userId, token) => {
    const response = await axios.patch(
      `${API}/${userId}/dashboard/reset`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  deleteDashboard: async (userId, token) => {
    const response = await axios.delete(
      `${API}/${userId}/dashboard`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Response Time =================

  getResponseTime: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/response-time`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Doctors =================

  getDoctors: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/doctors`,
      getHeaders(token)
    );
    return response.data;
  },

  getAvailableDoctors: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/doctors/available`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Donors =================

  getDonors: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/donors`,
      getHeaders(token)
    );
    return response.data;
  },

  getAvailableDonors: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/donors/available`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= AI Insight =================

  getInsight: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/insight`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= SOS =================

  raiseSOS: async (userId, data, token) => {
    const response = await axios.post(
      `${API}/${userId}/sos`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Emergency Status =================

  getEmergencyStatus: async (userId, token) => {
    const response = await axios.get(
      `${API}/${userId}/emergency-status`,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Contact Doctor =================

  contactDoctor: async (userId, data, token) => {
    const response = await axios.post(
      `${API}/${userId}/contact-doctor`,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // ================= Contact Helpline =================

  contactHelpline: async (userId, data, token) => {
    const response = await axios.post(
      `${API}/${userId}/helpline`,
      data,
      getHeaders(token)
    );
    return response.data;
  },
};

export default emergencyMedicalAPI;