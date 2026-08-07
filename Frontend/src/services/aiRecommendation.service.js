import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ai-recommendation";

// Create a dedicated axios instance for AI Recommendation with interceptors
const aiRecommendationAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach the token automatically
// Reads 'accessToken' which is the key stored by AuthContext on login/google login
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

// Response interceptor — handle errors and surface the real backend message
aiRecommendationAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract the most specific message available
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    if (error.response?.status === 401) {
      console.warn("[AI Recommendation] 401 Unauthorized:", backendMessage);
    } else if (error.response?.status === 500) {
      console.error("[AI Recommendation] 500 Server Error:", backendMessage);
    } else if (!error.response) {
      console.error("[AI Recommendation] Network Error:", backendMessage);
    }

    // Reject with a proper Error so err.message is always readable in components
    const err = new Error(backendMessage);
    err.statusCode = error.response?.status;
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

export const aiRecommendationAPI = {
  /**
   * Request a new AI travel recommendation.
   */
  generateRecommendation: async (data) => {
    const response = await aiRecommendationAxios.post("/", data);
    return response.data;
  },

  /**
   * Get recommendation history.
   */
  getHistory: async () => {
    const response = await aiRecommendationAxios.get("/history");
    return response.data;
  },

  /**
   * Get recent recommendations.
   */
  getRecent: async (limit = 5) => {
    const response = await aiRecommendationAxios.get(`/recent?limit=${limit}`);
    return response.data;
  },

  /**
   * Search history logs.
   */
  search: async (query) => {
    const response = await aiRecommendationAxios.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  /**
   * Get recommendation details by ID.
   */
  getDetails: async (id) => {
    const response = await aiRecommendationAxios.get(`/${id}`);
    return response.data;
  },

  /**
   * Bookmark or unbookmark a recommendation log.
   */
  bookmark: async (id) => {
    const response = await aiRecommendationAxios.post(`/${id}/bookmark`, {});
    return response.data;
  },

  /**
   * Delete a single recommendation record.
   */
  deleteItem: async (id) => {
    const response = await aiRecommendationAxios.delete(`/${id}`);
    return response.data;
  },

  /**
   * Clear all recommendation history.
   */
  clearHistory: async () => {
    const response = await aiRecommendationAxios.delete("/history");
    return response.data;
  },

  /**
   * Fetch supported booking providers list.
   */
  getBookingProviders: async () => {
    const response = await aiRecommendationAxios.get("/booking/providers");
    return response.data;
  },

  /**
   * Prepare booking payload and get redirect URL for provider.
   */
  prepareBooking: async (bookingData) => {
    const response = await aiRecommendationAxios.post("/booking/prepare", bookingData);
    return response.data;
  },
};
