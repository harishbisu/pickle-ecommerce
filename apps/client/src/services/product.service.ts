import { apiClient } from './api-client';
import { Product } from '../types';

export const productService = {
    list: () => apiClient.get<Product[]>('/products'),

    get: (id: string) => apiClient.get<Product>(`/products/${id}`),

    create: (data: Partial<Product>) =>
        apiClient.post<Product>('/products', data),

    update: (id: string, data: Partial<Product>) =>
        apiClient.patch<Product>(`/products/${id}`, data),

    delete: (id: string) => apiClient.delete<void>(`/products/${id}`),
};
