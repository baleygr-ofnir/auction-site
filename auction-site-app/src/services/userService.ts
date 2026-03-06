import api from '@/lib/client';
import type { UserResponse, UserRegisterRequest, UserLoginRequest, UserLoginResponse, UserUpdateRequest } from '@/types/user';
import type { BidSummaryResponse } from '@/types/bid';
import type {AuctionListItemResponse} from '@/types/auction';

const userService = {
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
    async getAll(): Promise<UserResponse[]> {
        const response = await api.get<UserResponse[]>('/users');
        return response.data;
    },
    async getUserAuctions(id: string): Promise<AuctionListItemResponse[]> {
        const response = await api.get<AuctionListItemResponse[]>(`/users/${id}/auctions`);
        return response.data;
    },
    async getUserBids(id: string): Promise<BidSummaryResponse[]> {
        const response = await api.get<BidSummaryResponse[]>(`/users/${id}/bids`);
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

export default userService;