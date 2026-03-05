import api from '@/lib/client';
import type { UserResponse, UserRegisterRequest, UserLoginRequest, UserLoginResponse, UserUpdateRequest } from '@/types/user';

export const userService = {
    async register(data: UserRegisterRequest): Promise<UserResponse> {
        const response = await api.post<UserResponse>('/users/register', data);
        return response.data;
    },
    async login(data: UserLoginRequest): Promise<UserLoginResponse> {
        const response = await api.post<UserLoginResponse>('/users/login', data);
        return response.data;
    },
    async getById(id: string): Promise<UserResponse> {
        const response = await api.get<UserResponse>(`/users/${id}`);
        return response.data;
    },
    async update(id: string, data: UserUpdateRequest): Promise<UserResponse> {
        const response = await api.put<UserResponse>(`/users/${id}`, data);
        return response.data;
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
};