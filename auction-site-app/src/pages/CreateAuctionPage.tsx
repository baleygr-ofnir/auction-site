import { CreateAuctionContainer } from '@/containers/auctions/CreateAuctionContainer.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CreateAuctionPage() {
    return (
        <ProtectedRoute>
            <CreateAuctionContainer />
        </ProtectedRoute>
    )
}