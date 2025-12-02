// src/api/momentApi.js
import axiosClient from "./axiosClient";

export const getAllMoments = (params = {}) => {
  const defaultParams = {
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  };

  // Merge default params và params người dùng truyền
  const finalParams = { ...defaultParams, ...params };

  Object.keys(finalParams).forEach((key) => {
    if (
      finalParams[key] === null ||
      finalParams[key] === undefined ||
      finalParams[key] === ""
    ) {
      delete finalParams[key];
    }
  });

  return axiosClient.get("/moments", { params: finalParams });
};

export const getMomentById = (id) => axiosClient.get(`/moments/${id}`);
export const createMoment = (data) => axiosClient.post("/moments", data);
export const updateMoment = (id, data) =>
  axiosClient.put(`/moments/${id}`, data);
export const deleteMoment = (id) => axiosClient.delete(`/moments/${id}`);
