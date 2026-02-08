"use client";

import { useQuery } from "@tanstack/react-query";

import { userService } from "@/api/services/userService";

export const USER_OPTIONS_QUERY_KEY = "user-options";

export function useUserOptionsQuery() {
  const query = useQuery({
    queryKey: [USER_OPTIONS_QUERY_KEY],
    queryFn: () => userService.getOptions(),
  });

  return {
    userOptions: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
