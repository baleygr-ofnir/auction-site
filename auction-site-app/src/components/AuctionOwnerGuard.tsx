import { useEffect, useState } from 'react';
import { Navigate, useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import auctionService from '@/services/auctionService';

export default function AuctionOwnerGuard() {
    const { id } = useParams();
    const { session } = useAuth();
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

    useEffect(() => {
        async function check() {
            if (!id || !session) {
                setStatus('unauthorized');
                return;
            }
            if (session.user.isAdmin) {
                setStatus('authorized');
                return;
            }
            try {
                const auction = await auctionService.getById(id);
                // Ensure IDs match (cast to String if one is a number/string mix)
                if (String(auction.creatorId) === String(session.user.id)) {
                    setStatus('authorized');
                } else {
                    setStatus('unauthorized');
                }
            } catch {
                setStatus('unauthorized');
            }
        }
        check();
    }, [id, session]);

    if (status === 'loading') return null;
    if (status === 'unauthorized') return <Navigate to="/auctions" replace />;

    return <Outlet />; // Only renders the child route if authorized
}