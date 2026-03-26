import axios from 'axios';
import type {
    LoginDto, RegisterDto, AuthResponse,
    ProductDto, CreateProductDto, UpdateProductDto
} from '../types';

const API = axios.create({
    baseURL: 'https://mytestapi-vndo.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Her isteðe otomatik JWT ekler
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const apiService = {
    // Auth Ýþlemleri
    auth: {
        login: (data: LoginDto) => API.post<AuthResponse>('/auth/login', data),
        register: (data: RegisterDto) => API.post('/auth/register', data),
    },
    // Ürün Ýþlemleri
    products: {
        getAll: () => API.get<ProductDto[]>('/products'),
        getById: (id: number) => API.get<ProductDto>(`/products/${id}`),
        create: (data: CreateProductDto) => API.post<ProductDto>('/products', data),
        update: (id: number, data: UpdateProductDto) => API.put(`/products/${id}`, data),
        delete: (id: number) => API.delete(`/products/${id}`),
    }
};