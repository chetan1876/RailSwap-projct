import axios from "axios";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =====================================================
   AXIOS INSTANCE
===================================================== */

const API = axios.create({
  baseURL: `${API_URL}/api/chatbot`,
  headers: {
    "Content-Type": "application/json",
  },
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
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

/* =====================================================
   CHATBOT API
===================================================== */

export const chatbotAPI = {
  // Send Message
  sendMessage: async (data) => {
    const response = await API.post("/chat", data);
    return response.data;
  },

  // Chat History
  getHistory: async (userId) => {
    const response = await API.get(`/history/${userId}`);
    return response.data;
  },

  // New Chat
  newChat: async (userId) => {
    const response = await API.post("/new", { userId });
    return response.data;
  },

  // Session Details
  getSession: async (sessionId) => {
    const response = await API.get(`/session/${sessionId}`);
    return response.data;
  },

  // Clear History
  clearHistory: async (userId) => {
    const response = await API.delete(`/history/${userId}`);
    return response.data;
  },
};

export default API;