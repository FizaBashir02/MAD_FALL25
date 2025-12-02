// src/api/cafeApi.js
import axiosClient from "./axiosClient";

// 📌 Lấy tất cả quán cafe
export const getAllCafes = (params = {}) => {
  const defaultParams = {
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  };

  // Gộp default và params truyền vào
  const mergedParams = { ...defaultParams, ...params };

  // Xử lý param: trim string, parse number nếu cần, xóa param rỗng
  const finalParams = Object.entries(mergedParams).reduce(
    (acc, [key, value]) => {
      if (value === null || value === undefined || value === "") return acc;

      // Trim string
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed !== "") acc[key] = trimmed;
      }
      // Ép kiểu số cho page/limit/rating
      else if (["page", "limit", "minRating", "maxRating"].includes(key)) {
        acc[key] = Number(value);
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  return axiosClient.get("/cafes", { params: finalParams });
};

// 📌 Lấy tất cả tên quán cafe
export const getAllCafeNames = () => axiosClient.get("/cafes/names");

// 📌 Lấy chi tiết 1 quán cafe theo ID
export const getCafeById = (id) => axiosClient.get(`/cafes/${id}`);

// 📌 Tạo quán cafe mới
export const createCafe = (data) => axiosClient.post("/cafes", data);

// 📌 Cập nhật quán cafe
export const updateCafe = (id, data) => axiosClient.put(`/cafes/${id}`, data);

// 📌 Xóa quán cafe
export const deleteCafe = (id) => axiosClient.delete(`/cafes/${id}`);
