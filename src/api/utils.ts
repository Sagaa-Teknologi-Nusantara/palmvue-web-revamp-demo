import { ApiErrorResponse, ApiResult } from "./types";

export function isApiError(
  response: ApiResult<unknown>,
): response is ApiErrorResponse {
  return !response.success;
}
