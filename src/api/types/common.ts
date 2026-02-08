export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface PaginationParams {
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface OptionItem {
  id: string;
  name: string;
}
