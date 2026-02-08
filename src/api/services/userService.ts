import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { OptionItem } from "../types/common";

export const userService = {
  getOptions: async (): Promise<OptionItem[]> => {
    const res = await apiClient.get(ENDPOINTS.USERS.OPTIONS);
    return res.data.data;
  },
};
