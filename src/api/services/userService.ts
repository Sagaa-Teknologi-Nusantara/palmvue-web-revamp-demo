import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { OptionItem } from "../types/common";

interface UserOptionResponse {
  id: string;
  username: string;
}

export const userService = {
  getOptions: async (): Promise<OptionItem[]> => {
    const res = await apiClient.get(ENDPOINTS.USERS.OPTIONS);
    return (res.data.data as UserOptionResponse[]).map((u) => ({
      id: u.id,
      name: u.username,
    }));
  },
};
