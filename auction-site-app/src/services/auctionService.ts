import api from '@/lib/client';
import type { AuctionListItemResponse, AuctionResponse, AuctionDetailResponse, AuctionCreateRequest, AuctionUpdateRequest } from '@/types/auction';

export const auctionService = {
    async getAuctions(search?: string): Promise<AuctionListItemResponse[]> {
        const response = await api.get<AuctionListItemResponse[]>('/auctions', {
            params: { search: search?.trim() }
        });
        return response.data;
    },
    async getById(id: string): Promise<AuctionDetailResponse> {
        const response = await api.get<AuctionDetailResponse>(`/auctions/${id}`);
        return response.data
    },
    async create(data: AuctionCreateRequest): Promise<AuctionResponse> {
        const response = await api.post<AuctionResponse>('/auctions', data);
        return response.data;
    },
    async update(id: string, data: AuctionUpdateRequest): Promise<AuctionResponse> {
        const response = await api.put<AuctionResponse>(`/auctions/${id}`, data);
        return response.data;
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/auctions/${id}`);
    }
}