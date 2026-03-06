// Libraries
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Custom hooks and services
import auctionService from '@/services/auctionService.ts';
import userService from '@/services/userService';
import bidService from '@/services/bidService';
import { useAuth } from '@/context/AuthContext';
// Custom Types
import type { AuctionDetailResponse, ClosedAuctionResponse } from '@/types/auction.ts';
// Reusable UI components
import { BidForm } from '@/components/BidForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Trophy, Clock, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function isClosedAuction(auction: AuctionDetailResponse): auction is ClosedAuctionResponse {
    return !auction.isActive;
}

export function AuctionContainer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session } = useAuth();
    const [auction, setAuction] = useState<AuctionDetailResponse | null>(null);
    const [ownerUsername, setOwnerUsername] = useState<string | null>(null);
    const [bidderNames, setBidderNames] = useState<Record<string, string>>({});
    const [winningUsername, setWinningUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUndoing, setIsUndoing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadAuction = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        try {
            const data = await auctionService.getById(id);
            const owner = await userService.getById(data.creatorId);
            setAuction(data);
            setOwnerUsername(owner.username);
            
            const currentBids = 'bids' in data ? data.bids : [];

            // 1. Get unique user IDs from the bids
            const uniqueUserIds = Array.from(new Set(currentBids.map(b => b.userId)));
            
            // 2. Fetch usernames for all unique bidders
            const nameMap: Record<string, string> = {};
            await Promise.all(uniqueUserIds.map(async (uid) => {
                try {
                    const user = await userService.getById(uid);
                    nameMap[uid] = user.username;
                } catch {
                    nameMap[uid] = 'Unknown User';
                }
            }));

            setBidderNames(nameMap);

            if (isClosedAuction(data) && data.winningUserId) {
                try {
                    const winner = await userService.getById(data.winningUserId);
                    setWinningUsername(winner.username);
                } catch (userError) {
                    console.error('Failed to fetch winner details', userError);
                    setWinningUsername('Unknown User');
                }
            }
        } catch (error) {
            setError('Could not find the requested auction.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadAuction();
    }, [loadAuction]);

    const handleUndoLatest = async () => {
        if (!id || !window.confirm("Are you sure you want to undo the latest bid?")) return;

        setIsUndoing(true);
        try {
            await bidService.removeLatestBid(id);
            await loadAuction(); // Refresh UI after removal
        } catch (err) {
            console.error("Failed to undo bid:", err);
            alert("Could not undo bid. Ensure it is still the latest bid, your bid and the auction is open.");
        } finally {
            setIsUndoing(false);
        }
    };

    if (isLoading) return <div className="text-slate-400 animate-pulse p-8">Loading auction details...</div>;
    if (error || !auction) return <div className="text-red-500 flex items-center gap-2 p-8"><AlertCircle /> {error}</div>;

    const isClosed = !auction.isActive;
    const isOwner = session?.user?.id === auction.creatorId;
    
    // Sorting: Newest/Highest at the top (Index 0)
    const bids = 'bids' in auction
        ? [...auction.bids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];

    const currentPrice = bids.length > 0
        ? Math.max(...bids.map(bid => bid.amount))
        : auction.startPrice;

    const latestBid = bids.length > 0 ? bids[0] : null;
    const canUndo = !isClosed && latestBid && session?.user?.id === latestBid.userId;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Content */}
            <div className="md:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-6 mb-2">
                    <div className="order-first sm:order-last shrink-0">
                        <Badge className="bg-slate-800 text-slate-300 border-slate-700 px-3 py-1">
                            {isClosed ? "Closed" : "Active"}
                        </Badge>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0 order-last sm:order-first">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-200 tracking-tight wrap-break-words leading-tight">
                            {auction.title}
                        </h1>
                        {isOwner && (
                            <Button
                                variant="link"
                                onClick={() => navigate(`/auctions/${auction.id}/edit`)}
                                className="p-0 h-auto text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 w-fit"
                            >
                                Edit listing
                            </Button>
                        )}
                        <h4 className="text-indigo-400 text-sm"><p className="text-slate-400">Creator</p>{ownerUsername}</h4>
                    </div>
                </div>

                <p className="text-slate-200 text-lg leading-relaxed">
                    {auction.description}
                </p>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex items-center gap-4 h-26">
                    <Clock className="text-indigo-400 h-6 w-6" />
                    <div>
                        <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Ends at</p>
                        <p className="text-slate-200">{new Date(auction.endTime).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Bidding & History */}
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400 uppercase">
                            { isClosed ? 'Winning bid' : 'Current highest bid'}
                        </CardTitle>

                        { canUndo && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleUndoLatest}
                                disabled={isUndoing}
                                className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                {isUndoing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RotateCcw className="h-3 w-3 mr-1" />}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isClosedAuction(auction) ? (
                            /* CLOSED AUCTION VIEW (Requirement #28/29) */
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-bold text-yellow-500">
                                    {auction.winningBidAmount
                                        ? `${auction.winningBidAmount} kr`
                                        : 'No Bids'}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm truncate">Winner: {winningUsername ? winningUsername : 'Loading...' }</span>
                                </div>
                            </div>
                        ) : (
                            /* ACTIVE AUCTION VIEW */
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-3xl font-bold text-green-400">
                                        {currentPrice} kr
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Gavel className="h-4 w-4" />
                                        <span className="text-sm">{bids.length} bids placed</span>
                                    </div>
                                </div>

                                {/* Requirement #17: Owner Check */}
                                {isOwner ? (
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-indigo-400 text-sm flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        You cannot bid on your own auction.
                                    </div>
                                ) : (
                                    <BidForm
                                        auctionId={auction.id}
                                        currentPrice={currentPrice}
                                        onBidSuccess={loadAuction}
                                    />
                                )}

                                {/* Bid History Section */}
                                {bids.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                            Bid History
                                        </h3>
                                        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
                                            <ul className="divide-y divide-slate-800">
                                                {bids.map((bid) => {
                                                    const isLatest = bid.id === latestBid?.id;
                                                    const isUserBid = session?.user?.id === bid.userId;

                                                    return (
                                                        <li key={bid.id} className={`p-3 flex justify-between items-center ${isLatest ? 'bg-green-400/5' : ''}`}>
                                                            <div className="flex flex-col">
                                                                <span className={`text-sm font-medium ${isLatest ? 'text-green-400' : 'text-slate-200'}`}>
                                                                    {bid.amount} kr
                                                                </span>
                                                                <span className="text-[10px] text-slate-500">
                                                                    {new Date(bid.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-slate-400">
                                                                    {bidderNames[bid.userId] || '...'}
                                                                </span>
                                                                {isLatest && isUserBid && (
                                                                    <Badge variant="outline" className="text-[9px] h-4 border-indigo-500/50 text-indigo-400 px-1">
                                                                        You
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}