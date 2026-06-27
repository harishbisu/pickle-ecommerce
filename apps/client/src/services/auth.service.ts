import { apiClient } from './api-client';
import { User } from '../types';

export const authService = {
    login: (email: string, password: string) =>
        apiClient.post<{ access_token: string }>('/auth/login', { email, password }),

    register: (email: string, password: string) =>
        apiClient.post<User>('/auth/register', { email, password }),

    profile: () => apiClient.get<User>('/auth/profile'),
};
