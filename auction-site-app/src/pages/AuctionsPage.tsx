import { AuctionsContainer } from '@/containers/auctions/AuctionsContainer';

export default function AuctionsPage() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-indigo-200">Listings</h1>
                <p className="text-slate-400 mt-4">Browse Listings</p>     
            </header>
            
            <AuctionsContainer />
        </div>
    );
}