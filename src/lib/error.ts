import type { ApiErrorResponse } from "@/api/types";

export function getErrorMessage(error: unknown, fallback?: string): string {
  const defaultMessage = fallback || "An unexpected error occurred";

  if (!error) {
    return defaultMessage;
  }

  if (isApiErrorResponse(error)) {
    return error.error.message || defaultMessage;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message) || defaultMessage;
  }

  return defaultMessage;
}

function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "success" in error &&
    (error as ApiErrorResponse).success === false &&
    "error" in error &&
    typeof (error as ApiErrorResponse).error === "object"
  );
}
