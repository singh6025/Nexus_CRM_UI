export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  page?: number;
  size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}
