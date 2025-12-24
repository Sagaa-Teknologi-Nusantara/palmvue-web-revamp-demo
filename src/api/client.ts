import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { tokenUtils } from "@/lib/token";

import { ApiErrorResponse } from "./types";

export const AUTH_ERROR_EVENT = "palmvue:auth:error";

export const dispatchAuthError = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT));
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      tokenUtils.clearAll();
      dispatchAuthError();
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    const fallbackError: ApiErrorResponse = {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error.message || "An unexpected error occurred",
      },
    };

    return Promise.reject(fallbackError);
  },
);

export default apiClient;
