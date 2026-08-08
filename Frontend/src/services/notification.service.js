import axios from "axios";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_BASE_URL = `${API_URL}/api/notifications`;

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
   NOTIFICATION API
===================================================== */

export const notificationAPI = {
  // Initialize Notifications
  initializeNotifications: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/initialize`,
      getHeaders(token)
    );
    return response.data;
  },

  // Get All Notifications
  getAllNotifications: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}`,
      getHeaders(token)
    );
    return response.data;
  },

  // Get Unread Notifications
  getUnreadNotifications: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/unread`,
      getHeaders(token)
    );
    return response.data;
  },

  // Get Notification Count
  getNotificationCount: async (userId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/${userId}/count`,
      getHeaders(token)
    );
    return response.data;
  },

  // Get Notification Details
  getNotificationDetails: async (notificationId, token) => {
    const response = await axios.get(
      `${API_BASE_URL}/details/${notificationId}`,
      getHeaders(token)
    );
    return response.data;
  },

  // Create Notification
  createNotification: async (data, token) => {
    const response = await axios.post(
      API_BASE_URL,
      data,
      getHeaders(token)
    );
    return response.data;
  },

  // Mark Notification as Read
  markAsRead: async (notificationId, token) => {
    const response = await axios.patch(
      `${API_BASE_URL}/${notificationId}/read`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  // Mark All Notifications as Read
  markAllAsRead: async (userId, token) => {
    const response = await axios.patch(
      `${API_BASE_URL}/${userId}/read-all`,
      {},
      getHeaders(token)
    );
    return response.data;
  },

  // Delete Single Notification
  deleteNotification: async (notificationId, token) => {
    const response = await axios.delete(
      `${API_BASE_URL}/${notificationId}`,
      getHeaders(token)
    );
    return response.data;
  },

  // Delete All Notifications
  deleteAllNotifications: async (userId, token) => {
    const response = await axios.delete(
      `${API_BASE_URL}/${userId}/all`,
      getHeaders(token)
    );
    return response.data;
  },
};

export default notificationAPI;