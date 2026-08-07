import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/notifications";

const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const notificationAPI = {
  initializeNotifications: async (userId, token) => {
    return axios.get(`${API_BASE_URL}/${userId}/initialize`, getHeaders(token));
  },

  getAllNotifications: async (userId, token) => {
    return axios.get(`${API_BASE_URL}/${userId}`, getHeaders(token));
  },

  getUnreadNotifications: async (userId, token) => {
    return axios.get(`${API_BASE_URL}/${userId}/unread`, getHeaders(token));
  },

  getNotificationCount: async (userId, token) => {
    return axios.get(`${API_BASE_URL}/${userId}/count`, getHeaders(token));
  },

  getNotificationDetails: async (notificationId, token) => {
    return axios.get(`${API_BASE_URL}/details/${notificationId}`, getHeaders(token));
  },

  createNotification: async (data, token) => {
    return axios.post(`${API_BASE_URL}`, data, getHeaders(token));
  },

  markAsRead: async (notificationId, token) => {
    return axios.patch(`${API_BASE_URL}/${notificationId}/read`, {}, getHeaders(token));
  },

  markAllAsRead: async (userId, token) => {
    return axios.patch(`${API_BASE_URL}/${userId}/read-all`, {}, getHeaders(token));
  },

  deleteNotification: async (notificationId, token) => {
    return axios.delete(`${API_BASE_URL}/${notificationId}`, getHeaders(token));
  },

  deleteAllNotifications: async (userId, token) => {
    return axios.delete(`${API_BASE_URL}/${userId}/all`, getHeaders(token));
  },
};
