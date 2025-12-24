import { jwtDecode } from "jwt-decode";

import { tokenUtils } from "@/lib/token";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import {
  ApiResponse,
  AuthUser,
  JwtPayload,
  LoginRequest,
  LoginResponse,
} from "../types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    const { data } = response.data;
    tokenUtils.setToken(data.token);

    return data;
  },

  logout: (): void => {
    tokenUtils.clearAll();
  },

  getCurrentUser: (): AuthUser | null => {
    const token = tokenUtils.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        tokenUtils.clearAll();
        return null;
      }

      return {
        id: decoded.user_id || decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  },
};

export default authService;
