// User types
export interface UserLoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface UserLoginResponse {
    token: string;
    user: UserResponse;
}

export interface UserRegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isAdmin: boolean;
}

export interface UserUpdateRequest {
    email?: string;
    password?: string;
    isActive?: boolean;
    isAdmin?: boolean;
}

// Auction types
export interface AuctionCreateRequest {
    title: string;
    description: string;
    startPrice: number;
    startTime: Date;
    endTime: Date;
}

export interface AuctionListItemResponse {
    id: string;
    title: string
    endTime: Date;
    isActive: boolean;
    currentPrice: number;
}

export interface AuctionResponse {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    creatorId: string;
}

export interface AuctionUpdateRequest {
    title?: string;
    description?: string;
    endTime?: string;
    isActive?: boolean;
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
    winningUserId?: string;
}

export interface BidCreateRequest {
    amount: number;
}

export interface BidSummaryResponse {
    id: string;
    amount: number;
    createdAt: Date;
    userId: string;
}