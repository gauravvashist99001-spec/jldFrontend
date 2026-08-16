import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://jldbrontend.onrender.com/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach admin token automatically if present (only matters for admin calls;
// public "view" endpoints ignore the header entirely).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
