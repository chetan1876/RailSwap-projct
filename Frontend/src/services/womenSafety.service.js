import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api/women-safety";

export const womenSafetyAPI = {
  getDashboard: async (userId, token) => {
    return axios.get(
      `${API_BASE_URL}/${userId}/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  refreshDashboard: async (userId, token) => {
    return axios.patch(
      `${API_BASE_URL}/${userId}/dashboard/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getSafetyScore: async (userId, token) => {
    return axios.get(
      `${API_BASE_URL}/${userId}/safety-score`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getSafeSeats: async (userId, token) => {
    return axios.get(
      `${API_BASE_URL}/${userId}/safe-seats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getCompanions: async (userId, token) => {
    return axios.get(
      `${API_BASE_URL}/${userId}/companions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  connectCompanion: async (
    userId,
    data,
    token
  ) => {
    return axios.post(
      `${API_BASE_URL}/${userId}/companions/connect`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  raiseSOS: async (
    userId,
    data,
    token
  ) => {
    return axios.post(
      `${API_BASE_URL}/${userId}/sos`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  contactRPF: async (
    userId,
    data,
    token
  ) => {
    return axios.post(
      `${API_BASE_URL}/${userId}/rpf`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  contactHelpline: async (
    userId,
    data,
    token
  ) => {
    return axios.post(
      `${API_BASE_URL}/${userId}/helpline`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getInsight: async (
    userId,
    token
  ) => {
    return axios.get(
      `${API_BASE_URL}/${userId}/insight`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};