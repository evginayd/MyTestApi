// Auth DTOs
export interface LoginDto {
  username: string;
  passwordHash: string;
}

export interface RegisterDto {
  username: string;
  passwordHash: string;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  userId: string;
  username: string;
  role: string;
}

// Product DTOs
export interface ProductDto {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
}

export interface UpdateProductDto {
  name: string;
  price: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  desc?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
