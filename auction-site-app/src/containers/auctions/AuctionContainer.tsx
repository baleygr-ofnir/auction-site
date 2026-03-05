import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { auctionService } from '@/services/auctionService.ts';
import { userService } from '@/services/userService';
import { BidForm } from '@/components/BidForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Trophy, Clock, AlertCircle } from 'lucide-react';
import type { AuctionDetailResponse, ClosedAuctionResponse } from '@/types/auction.ts';

function isClosedAuction(auction: AuctionDetailResponse): auction is ClosedAuctionResponse {
    return !auction.isActive;
}

export function AuctionContainer() {
    const { id } = useParams<{ id: string }>();
    const [auction, setAuction] = useState<AuctionDetailResponse | null>(null);
    const [winningUsername, setWinningUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAuction = useCallback(async () => {
        if (!id) return;
        
        setIsLoading(true);
        try {
            const data = await auctionService.getById(id);
            setAuction(data);
            
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
    
    if (isLoading) return <div className="text-slate-400 animate-pulse">Loading auction details...</div>;
    if (error || !auction) return <div className="text-red-500 flex items-center gap-2"><AlertCircle /> {error}</div>;
    
    const isClosed = !auction.isActive;
    const currentPrice = 'bids' in auction && auction.bids.length > 0
        ? Math.max(...auction.bids.map(bid => bid.amount))
        : auction.startPrice;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-bold text-slate-100">{auction.title}</h1>
                    <Badge variant={isClosed ? "destructive" : "default"}>
                        {isClosed ? "Closed" : "Active"}
                    </Badge>
                </div>
                
                <p className="text-slate-300 text-lg leading-relaxed">
                    {auction.description}
                </p>
                
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex items-center gap-4">
                    <Clock className="text-blue-400 h-6 w-6" />
                    <div>
                        <p className="text-slate-500 text-sm uppercase font-bold tracking-wider">Ends at</p>
                        <p className="text-slate-200">{new Date(auction.endTime).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400 uppercase">
                            { isClosed ? 'Winning bid' : 'Current highest bid'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isClosedAuction(auction) ? (
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-bold text-yellow-500">
                                    {auction.winningBidAmount
                                        ? `${auction.winningBidAmount.toLocaleString()} kr`
                                        : 'No Bids'}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm truncate">Winner: {winningUsername ? winningUsername : 'Loading...' }</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <span className="text-3xl font-bold text-blue-400">
                                    {currentPrice.toLocaleString()} kr
                                </span>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Gavel className="h-4 w-4" />
                                    <span className="text-sm">{'bids' in auction ? auction.bids.length : 0} bids placed</span>
                                </div>
                                
                                <BidForm
                                    auctionId={auction.id}
                                    currentPrice={currentPrice}
                                    onBidSuccess={loadAuction}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}