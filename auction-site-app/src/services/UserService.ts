import { api } from '../config/api';
import type { UserResponse, UserLoginResponse, UserLoginRequest, UserRegisterRequest, UserUpdateRequest } from '../types/Types';

export const UserService = {
    login: (data: UserLoginRequest) =>
        api.post<UserLoginResponse>('/api/users/login', data)
            .then(response => response.data),
    register: (data: UserRegisterRequest) =>
        api.post<UserLoginResponse>('/api/users/register', data)
            .then(response => response.data),
    getById: (id: string) => api.get<UserResponse>(`/api/users/${id}`),
    getByUsername: (username: string) => api.get<UserResponse>(`/api/user/${username}`),
    update: (id: string, data: UserUpdateRequest) => api.put<UserResponse>(`/api/users/${id}`, data),
    delete: (id: string) => api.delete(`/api/users/${id}`),
};