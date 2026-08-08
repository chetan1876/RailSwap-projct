import api from "./api";

export const getProjectRecords = async (role, status) => {
  const params = {};
  if (role) params.role = role;
  if (status) params.status = status;
  return await api.get("/api/project-records", { params });
};

export const getProjectRecordById = async (id) => {
  return await api.get(`/api/project-records/${id}`);
};

export const createProjectRecord = async (recordData) => {
  return await api.post("/api/project-records", recordData);
};

export const seedProjectRecords = async () => {
  return await api.post("/api/project-records/seed");
};
