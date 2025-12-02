// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Lấy baseURL từ .env
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional
});

// 👉 Thêm interceptors nếu cần (ví dụ xử lý token hoặc lỗi)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
