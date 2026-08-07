import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/chatbot",
});

export const chatbotAPI = {
  sendMessage: (data) => API.post("/chat", data),

  getHistory: (userId) => API.get(`/history/${userId}`),

  newChat: (userId) => API.post("/new", { userId }),

  getSession: (sessionId) => API.get(`/session/${sessionId}`),

  clearHistory: (userId) => API.delete(`/history/${userId}`),
};
