import { useParams } from 'react-router-dom';
import EditAuctionContainer from '@/containers/auctions/EditAuctionContainer';

export default function EditAuctionPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div className="p-8 text-center text-red-500">Error: Missing ID</div>;

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <EditAuctionContainer />
        </div>
    );
}