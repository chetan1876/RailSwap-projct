import api from "./api";

/*
========================================
JOURNEY COMPANION FRONTEND API SERVICE
========================================
*/

export const createJourney = async (journeyData) => {
  const response = await api.post("/journey/create", journeyData);
  return response.data;
};

export const getUserJourneys = async (userId = "default_user") => {
  const response = await api.get(`/journey/user/${userId}`);
  return response.data;
};

export const getJourneyDetails = async (journeyId) => {
  const response = await api.get(`/journey/details/${journeyId}`);
  return response.data;
};

export const updateJourney = async (journeyId, updateData) => {
  const response = await api.put(`/journey/update/${journeyId}`, updateData);
  return response.data;
};

export const deleteJourney = async (journeyId) => {
  const response = await api.delete(`/journey/delete/${journeyId}`);
  return response.data;
};

export const searchTrainOrPNR = async (query) => {
  const response = await api.get("/journey/search", { params: { query } });
  return response.data;
};

export const askAIAssistant = async (journeyId, question) => {
  const response = await api.post("/journey/ai-assistant", { journeyId, question });
  return response.data;
};

export const getAITips = async (journeyData) => {
  const response = await api.post("/journey/ai-tips", journeyData);
  return response.data;
};

export const addChecklistItem = async (journeyId, itemData) => {
  const response = await api.post(`/journey/checklist/${journeyId}`, itemData);
  return response.data;
};

export const toggleChecklistItem = async (journeyId, itemId) => {
  const response = await api.patch(`/journey/checklist/${journeyId}/${itemId}/toggle`);
  return response.data;
};

export const deleteChecklistItem = async (journeyId, itemId) => {
  const response = await api.delete(`/journey/checklist/${journeyId}/${itemId}`);
  return response.data;
};

export const addNote = async (journeyId, noteData) => {
  const response = await api.post(`/journey/notes/${journeyId}`, noteData);
  return response.data;
};

export const togglePinNote = async (journeyId, noteId) => {
  const response = await api.patch(`/journey/notes/${journeyId}/${noteId}/pin`);
  return response.data;
};

export const deleteNote = async (journeyId, noteId) => {
  const response = await api.delete(`/journey/notes/${journeyId}/${noteId}`);
  return response.data;
};

export const getUserAnalytics = async (userId = "default_user") => {
  const response = await api.get(`/journey/analytics/${userId}`);
  return response.data;
};

export const saveJourneyMemory = async (journeyId, memoryData) => {
  const response = await api.post(`/journey/memories/${journeyId}`, memoryData);
  return response.data;
};
