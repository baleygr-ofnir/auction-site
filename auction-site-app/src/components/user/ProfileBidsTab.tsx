import type { BidSummaryResponse } from '@/types/bid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProfileBidsTabProps {
    bids: BidSummaryResponse[];
    isLoading: boolean;
}

export function ProfileBidsTab({ bids, isLoading }: ProfileBidsTabProps) {
    return (
        <Card className="bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader>
                <CardTitle className="text-indigo-400">My Bids</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-slate-400 animate-pulse">Loading your bids...</p>
                ) : bids.length === 0 ? (
                    <p className="text-slate-400">You have not placed any bids.</p>
                ) : (
                    <ul className="space-y-4">
                        {bids.map(bid => (
                            <li key={bid.id} className="p-4 border border-slate-800 rounded-md bg-slate-900 flex justify-between items-center">
                                <span className="text-slate-300">
                                    Placed on {new Date(bid.createdAt).toLocaleString()}
                                </span>
                                <span className="text-green-400 font-semibold">{bid.amount} kr</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}