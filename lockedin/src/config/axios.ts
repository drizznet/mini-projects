/** Shared Axios instance for the Focus OS backend. */
import axios from "axios";

import {
  clearLocalAuthSession,
  getLocalAuthToken,
} from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bobslab.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = getLocalAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      clearLocalAuthSession();
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
