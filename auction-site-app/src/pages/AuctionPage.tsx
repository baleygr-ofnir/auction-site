import { useNavigate } from 'react-router-dom';
import { AuctionContainer } from '@/containers/auctions/AuctionContainer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function AuctionPage() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <Button
                className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800"
                variant="ghost"
                onClick={() => navigate('/auctions')}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
            </Button>
            
            <AuctionContainer />
        </div>
    );
}