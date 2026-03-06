// Libraries
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Custom hooks and services
import auctionService from '@/services/auctionService';
// Custom types
import type { AuctionListItemResponse } from '@/types/auction.ts';
// Reusable UI components
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gavel, Clock, AlertCircle } from 'lucide-react';

export function AuctionsContainer() {
    const [searchParams] = useSearchParams();
    const [auctions, setAuctions] = useState<AuctionListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchAuctions = async () => {
            setIsLoading(true);
            
            try {
                const data = await auctionService.getActiveAuctions(searchQuery);
                setAuctions(data);
                setError(null);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAuctions();
    }, [searchQuery]);
    
    if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse">Loading auctions...</div>;
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
                <AlertCircle className="h-8 w-8" />
                <p>{error}</p>
            </div>
        );
    }
    
    if (auctions.length === 0) {
        return (
            <div className="text-center py-20 text-slate-400 bg-slate-900/50 rounded-lg border border-slate-800">
                No active auctions found {searchQuery && `for this search term: "${searchQuery}"`}.
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
                <Card
                    key={auction.id}
                    className="bg-slate-900 border-indigo-900 flex flex-col hover:border-indigo-700 transition-colors"
                >
                    <CardHeader>
                        <CardTitle className="text-slate-200 line-clamp-1">{auction.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grow">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Current Bid</span>
                                <span className="text-green-400 font-bold text-lg">
                                    {auction.currentPrice} kr
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>End: {new Date(auction.endTime).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link
                            to={`/auctions/${auction.id}`}
                            className="w-full"
                        >
                            <Button className="w-full bg-indigo-900 hover:bg-indigo-900 text-white">
                                <Gavel className="mr-2 h-4 w-4">View Auction</Gavel>
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}