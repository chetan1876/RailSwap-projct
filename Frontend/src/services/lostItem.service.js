import api from "./api";

// Verify PNR for Lost Item
export const verifyPNRForLostItem = async (pnr) => {
  const response = await api.post("/lost-items/verify-pnr", { pnr });
  return response.data;
};

// Create Lost Item Request
export const reportLostItem = async (formData) => {
  const response = await api.post("/lost-items/report", formData);
  return response.data;
};

// Get My Lost Items
export const getMyLostItems = async (pnr = "") => {
  const response = await api.get(`/lost-items/my${pnr ? `?pnr=${pnr}` : ""}`);
  return response.data;
};

// Get Lost Item Details By ID
export const getLostItemById = async (id) => {
  const response = await api.get(`/lost-items/${id}`);
  return response.data;
};

// Update Lost Item Status
export const updateLostItemStatus = async (id, status) => {
  const response = await api.patch("/lost-items/status", { id, status });
  return response.data;
};
