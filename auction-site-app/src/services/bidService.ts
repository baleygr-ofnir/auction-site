import api from '@/lib/client';
import type { BidCreateRequest, BidSummaryResponse } from '@/types/bid.ts';

export const bidService = {
    async placeBid(auctionId: string, data: BidCreateRequest): Promise<BidSummaryResponse> {
        const response = await api.post<BidSummaryResponse>(`/auctions/${auctionId}/bids`, data);
        return response.data;
    },
    async removeLatestBid(auctionId: string): Promise<void> {
        await api.delete(`/auctions/${auctionId}/bids/latest`);
    }
};