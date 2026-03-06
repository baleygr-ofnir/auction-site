import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import auctionService from '@/services/auctionService';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
    checkAuctionOwnership?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, checkAuctionOwnership = false }: ProtectedRouteProps) {
    const { session } = useAuth();
    const { id } = useParams();
    const location = useLocation();

    // Status starts as 'checking' so we render NOTHING initially
    const [status, setStatus] = useState<'checking' | 'authorized' | 'denied'>('checking');

    useEffect(() => {
        async function verify() {
            // 1. If not logged in at all, immediate fail
            if (!session) {
                setStatus('denied');
                return;
            }

            // 2. If it's an admin-only route and user isn't admin, fail
            if (requireAdmin && !session.user.isAdmin) {
                setStatus('denied');
                return;
            }

            // 3. THE OWNERSHIP LOCK
            if (checkAuctionOwnership && id) {
                // Admins bypass the ownership check
                if (session.user.isAdmin) {
                    setStatus('authorized');
                    return;
                }

                try {
                    const auction = await auctionService.getById(id);

                    // We use String() to ensure "1" === 1 doesn't fail the check
                    const isOwner = String(auction.creatorId) === String(session.user.id);

                    if (isOwner) {
                        setStatus('authorized');
                    } else {
                        console.error("Access Denied: User does not own this auction.");
                        setStatus('denied');
                    }
                } catch (err) {
                    setStatus('denied');
                }
            } else {
                // No ownership check required for this route
                setStatus('authorized');
            }
        }

        verify();
    }, [session, id, requireAdmin, checkAuctionOwnership]);

    // BLOCKER: While we are checking, return null. 
    // This prevents EditAuctionPage from ever mounting or running its own code.
    if (status === 'checking') return null;

    // BOUNCE: If they failed any check, kick them to the auctions list
    if (status === 'denied') {
        const target = !session ? "/login" : "/auctions";
        return <Navigate to={target} state={{ from: location }} replace />;
    }

    // SUCCESS: Only now do we render the actual page content
    // 'grow' is the Tailwind v4 way to fill the screen properly
    return <div className="grow flex flex-col w-full">{children}</div>;
}