import axios from "axios";

const API = "http://localhost:5000/api/emergency-medical";

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const emergencyMedicalAPI = {
  // Dashboard
  initializeDashboard: (userId, token) =>
    axios.post(`${API}/${userId}/dashboard`, {}, getHeaders(token)),

  getDashboard: (userId, token) =>
    axios.get(`${API}/${userId}/dashboard`, getHeaders(token)),

  refreshDashboard: (userId, token) =>
    axios.patch(`${API}/${userId}/dashboard/refresh`, {}, getHeaders(token)),

  resetDashboard: (userId, token) =>
    axios.patch(`${API}/${userId}/dashboard/reset`, {}, getHeaders(token)),

  deleteDashboard: (userId, token) =>
    axios.delete(`${API}/${userId}/dashboard`, getHeaders(token)),

  // Response Time
  getResponseTime: (userId, token) =>
    axios.get(`${API}/${userId}/response-time`, getHeaders(token)),

  // Doctors
  getDoctors: (userId, token) =>
    axios.get(`${API}/${userId}/doctors`, getHeaders(token)),

  getAvailableDoctors: (userId, token) =>
    axios.get(`${API}/${userId}/doctors/available`, getHeaders(token)),

  // Donors
  getDonors: (userId, token) =>
    axios.get(`${API}/${userId}/donors`, getHeaders(token)),

  getAvailableDonors: (userId, token) =>
    axios.get(`${API}/${userId}/donors/available`, getHeaders(token)),

  // AI Insight
  getInsight: (userId, token) =>
    axios.get(`${API}/${userId}/insight`, getHeaders(token)),

  // Emergency SOS
  raiseSOS: (userId, data, token) =>
    axios.post(`${API}/${userId}/sos`, data, getHeaders(token)),

  // Emergency Status
  getEmergencyStatus: (userId, token) =>
    axios.get(`${API}/${userId}/emergency-status`, getHeaders(token)),

  // Contact Doctor
  contactDoctor: (userId, data, token) =>
    axios.post(`${API}/${userId}/contact-doctor`, data, getHeaders(token)),

  // Contact Helpline
  contactHelpline: (userId, data, token) =>
    axios.post(`${API}/${userId}/helpline`, data, getHeaders(token)),
};