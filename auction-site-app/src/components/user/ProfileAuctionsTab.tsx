import { Link } from 'react-router-dom';
import type { AuctionListItemResponse } from '@/types/auction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProfileAuctionsTabProps {
    auctions: AuctionListItemResponse[];
    isLoading: boolean;
}

export function ProfileAuctionsTab({ auctions, isLoading }: ProfileAuctionsTabProps) {
    return (
        <Card className="bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-indigo-400">My Auctions</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-slate-400">Loading auctions...</p>
                ) : auctions.length === 0 ? (
                    <p className="text-slate-400">You haven't created any auctions yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {auctions.map(auction => (
                            <li key={auction.id} className="p-4 border-slate-800 rounded-md bg-slate-900">
                                <Link to={`/auctions/${auction.id}`} className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-200">{auction.title}</span>
                                    <span className="text-green-400">{auction.currentPrice} kr</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}