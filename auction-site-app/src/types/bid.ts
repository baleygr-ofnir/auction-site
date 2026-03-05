export interface BidCreateRequest {
    amount: number;
}

export interface BidSummaryResponse {
    id: string;
    amount: number;
    createdAt: Date;
    userId: string;
}