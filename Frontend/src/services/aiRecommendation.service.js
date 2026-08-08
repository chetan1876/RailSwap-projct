import axios from "axios";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_BASE_URL = `${API_URL}/api/ai-recommendation`;

/* =====================================================
   AXIOS INSTANCE
===================================================== */

const aiRecommendationAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   REQUEST INTERCEPTOR
===================================================== */

aiRecommendationAxios.interceptors.request.use(
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

aiRecommendationAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    if (error.response?.status === 401) {
      console.warn(
        "[AI Recommendation] Unauthorized:",
        backendMessage
      );
    } else if (error.response?.status === 500) {
      console.error(
        "[AI Recommendation] Server Error:",
        backendMessage
      );
    } else if (!error.response) {
      console.error(
        "[AI Recommendation] Network Error:",
        backendMessage
      );
    }

    const err = new Error(backendMessage);
    err.statusCode = error.response?.status;
    err.data = error.response?.data;

    return Promise.reject(err);
  }
);

/* =====================================================
   API METHODS
===================================================== */

export const aiRecommendationAPI = {
  // Generate AI Recommendation
  generateRecommendation: async (data) => {
    const response = await aiRecommendationAxios.post("/", data);
    return response.data;
  },

  // History
  getHistory: async () => {
    const response = await aiRecommendationAxios.get("/history");
    return response.data;
  },

  // Recent
  getRecent: async (limit = 5) => {
    const response = await aiRecommendationAxios.get(
      `/recent?limit=${limit}`
    );
    return response.data;
  },

  // Search
  search: async (query) => {
    const response = await aiRecommendationAxios.get(
      `/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Details
  getDetails: async (id) => {
    const response = await aiRecommendationAxios.get(`/${id}`);
    return response.data;
  },

  // Bookmark
  bookmark: async (id) => {
    const response = await aiRecommendationAxios.post(
      `/${id}/bookmark`,
      {}
    );
    return response.data;
  },

  // Delete
  deleteItem: async (id) => {
    const response = await aiRecommendationAxios.delete(`/${id}`);
    return response.data;
  },

  // Clear History
  clearHistory: async () => {
    const response = await aiRecommendationAxios.delete("/history");
    return response.data;
  },

  // Booking Providers
  getBookingProviders: async () => {
    const response = await aiRecommendationAxios.get(
      "/booking/providers"
    );
    return response.data;
  },

  // Prepare Booking
  prepareBooking: async (bookingData) => {
    const response = await aiRecommendationAxios.post(
      "/booking/prepare",
      bookingData
    );
    return response.data;
  },
};

export default aiRecommendationAxios;