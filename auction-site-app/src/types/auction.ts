import type { BidSummaryResponse } from '@/types/bid';

export interface AuctionCreateRequest {
    title: string;
    description: string;
    startPrice: number;
    startTime: Date;
    endTime: Date;
}

export interface AuctionListItemResponse {
    id: string;
    title: string;
    endTime: Date;
    isActive: boolean;
    currentPrice: number; // set from bids or StartPrice
}

export interface AuctionResponse {
    id: string;
    title: string;
    description: string;
    startPrice: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    bids: BidSummaryResponse[];
    creatorId: string;
}

export interface ClosedAuctionResponse {
    id: string;
    title: string;
    description: string;
    startPrice: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    winningBidAmount?: number;
    winningUserId: string;
    creatorId: string;
}

export type AuctionDetailResponse = AuctionResponse | ClosedAuctionResponse;

export interface AuctionUpdateRequest {
    title: string;
    description: string;
    endTime: Date;
    isActive: boolean;
}
