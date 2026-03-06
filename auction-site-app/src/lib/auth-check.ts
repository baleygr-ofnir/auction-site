import auctionService from '@/services/auctionService';
import { redirect } from 'react-router-dom';

export async function editAuctionLoader({ params }: any) {
    const sessionStr = localStorage.getItem('auction-auth');

    // If no session, go to login (this is the only time we redirect to login)
    if (!sessionStr) return redirect('/login');

    const session = JSON.parse(sessionStr);
    const userId = session.user.id;
    const isAdmin = session.user.isAdmin;

    try {
        const auction = await auctionService.getById(params.id);

        // Match IDs as strings to be safe
        const isOwner = String(auction.creatorId) === String(userId);

        // If you aren't the owner AND you aren't an admin, bounce to the auction detail page
        if (!isOwner && !isAdmin) {
            console.warn("Access denied: Not the owner.");
            return redirect(`/auctions/${params.id}`);
        }
    } catch (error) {
        // If the auction doesn't exist or API fails, go back to root
        return redirect('/auctions');
    }

    return null; // Authorized
}