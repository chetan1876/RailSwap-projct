import api from "./api";

/*
========================================
CROWD DENSITY FRONTEND API SERVICE
Backend base: /api/crowd-prediction
========================================
*/

// POST /api/crowd-prediction/search — Universal smart search
export const searchCrowd = async (query, filters = {}) => {
  const response = await api.post("/crowd-prediction/search", {
    query,
    ...filters,
  });
  return response.data;
};

// GET /api/crowd-prediction/train/:id — Full train crowd data
export const getTrainCrowd = async (trainId) => {
  const response = await api.get(`/crowd-prediction/train/${trainId}`);
  return response.data;
};

// GET /api/crowd-prediction/coach/:coach — Coach crowd data
export const getCoachCrowd = async (coachCode) => {
  const response = await api.get(`/crowd-prediction/coach/${coachCode}`);
  return response.data;
};

// GET /api/crowd-prediction/heatmap/:train — Heatmap data
export const getTrainHeatmap = async (trainId) => {
  const response = await api.get(`/crowd-prediction/heatmap/${trainId}`);
  return response.data;
};

// GET /api/crowd-prediction/timeline/:train — Timeline predictions
export const getTrainTimeline = async (trainId) => {
  const response = await api.get(`/crowd-prediction/timeline/${trainId}`);
  return response.data;
};

// GET /api/crowd-prediction/recommendation — AI recommendations
export const getRecommendations = async (query) => {
  const response = await api.get("/crowd-prediction/recommendation", {
    params: { query },
  });
  return response.data;
};

// GET /api/crowd-prediction/alerts — Smart alerts
export const getAlerts = async (query) => {
  const response = await api.get("/crowd-prediction/alerts", {
    params: { query },
  });
  return response.data;
};

// GET /api/crowd-prediction/dashboard — Dashboard summary
export const getCrowdDashboard = async () => {
  const response = await api.get("/crowd-prediction/dashboard");
  return response.data;
};
