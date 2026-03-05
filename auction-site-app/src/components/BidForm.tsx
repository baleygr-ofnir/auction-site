import { useState, type SubmitEvent } from 'react';
import { bidService } from '@/services/bidService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';


interface BidContainerProps {
    auctionId: string;
    currentPrice: number;
    onBidSuccess: () => void;
}

export function BidForm({ auctionId, currentPrice, onBidSuccess}: BidContainerProps) {
    const { session } = useAuth();
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);
        
        const bidAmount = parseFloat(amount);
        
        if (isNaN(bidAmount) || bidAmount <= currentPrice) {
            setError(`Your bid must be higher than ${currentPrice.toLocaleString()} kr`);
            return;
        }
        
        setIsLoading(true);
        try {
            await bidService.placeBid(auctionId, { amount: bidAmount });
            setAmount('');
            onBidSuccess();
        } catch (error: any) {
            const backendError = error.response?.data;
            setError(typeof backendError === 'string' ? backendError : 'Failed to place bid. Please try again.');
            console.error('Bid placement error: ', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!session) {
        return (
            <div className="mt-6 p-4 border border-slate-800 bg-slate-900/50 rounded-md text-center">
                <p className="text-slate-400 text-sm">You must be logged in to place a bid.</p>
            </div>
        );
    }
    
    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 bg-slate-950 p-4 rounded-lg border border-slate-800"
        >
            <Label
                htmlFor="bidAmount"
                className="flex gap-2"
            >
                <p className="text-indigo-400">Your Max Bid (kr)</p>
            </Label>
            <div className="flex gap-2">
                <Input
                    id="bidAmount"
                    name="bidAmount"
                    min={currentPrice + 1}
                    step="1"
                    placeholder={`${currentPrice + 1}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                    className="bg-slate-900 border-slate-700 text-slate-100"
                    required
                />
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-25"
                >
                    {isLoading ? <Loader2 className="flex items-center gap-2 text-red-400 text-sm mt-2" /> : 'Place Bid'}
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </form>
    );
}