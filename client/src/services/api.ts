import api from '@/lib/axios';
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  PaginationParams,
} from '@/types';

export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterDto) => api.post('/auth/register', data),
};

export const productsApi = {
  getAll: (params?: PaginationParams) =>
    api.get<ProductDto[]>('/products', { params }),

  getById: (id: number) => api.get<ProductDto>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    api.post<ProductDto>('/products', data),

  update: (id: number, data: UpdateProductDto) =>
    api.put(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),

  restore: (id: number) => api.put(`/products/restore/${id}`),

  deleteImage: (id: number) => api.delete(`/products/${id}/image`),

  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ imageUrl: string }>(`/products/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
