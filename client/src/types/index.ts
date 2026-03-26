// Auth DTOs
export interface LoginDto {
    username: string;
    passwordHash: string; // Backend isimlendirmenle uyumlu
}

export interface RegisterDto {
    username: string;
    passwordHash: string;
    fullName: string;
    email: string;
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

// Auth Response (Login baþarýlý olduðunda dönen yapý)
export interface AuthResponse {
    token: string;
    username: string;
}