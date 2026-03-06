// Libraries
import { useEffect, useState } from 'react';
// Custom hooks and services
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
// Custom types
import type { AuctionListItemResponse } from '@/types/auction';
import type { BidSummaryResponse } from '@/types/bid';
// Reusable UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {ProfileAccountTab} from '@/components/user/ProfileAccountTab';
import {ProfileAuctionsTab} from '@/components/user/ProfileAuctionsTab';
import {ProfileBidsTab} from '@/components/user/ProfileBidsTab';

export function ProfileContainer() {
    const { session } = useAuth();
    const [myAuctions, setMyAuctions] = useState<AuctionListItemResponse[]>([]);
    const [isLoadingAuctions, setIsLoadingAuctions] = useState(true);
    const [myBids, setMyBids] = useState<BidSummaryResponse[]>([]);
    const [isLoadingBids, setIsLoadingBids] = useState(true);

    useEffect(() => {
        if (!session?.user.id) return;
        
        const fetchProfileData = async () => {
            setIsLoadingAuctions(true);
            setIsLoadingBids(true);
            
            try {
                const [auctions, bids] = await Promise.all([
                    userService.getUserAuctions(session.user.id),
                    userService.getUserBids(session.user.id),
                ]);
                
                setMyAuctions(auctions);
                setMyBids(bids);
            } catch (error) {
                console.error('Failed fetching profile data', error);
            } finally {
                setIsLoadingAuctions(false);
                setIsLoadingBids(false);
            }
        };
        
        fetchProfileData();
    }, [session?.user.id]);
   
    
    if (!session) return null;
    
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-indigo-400 break-words">
                Welcome, {session.user.username}
            </h1>

            <Tabs className="w-full" defaultValue="account">
                <TabsList className="flex w-full justify-start overflow-x-auto border-b border-slate-800 bg-transparent p-0 h-auto rounded-none mb-8 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <TabsTrigger
                        value="account"
                        className="whitespace-nowrap shrink-0 rounded-none border-b-2 border-transparent px-4 sm:px-6 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-300 data-[state=active]:border-slate-200 data-[state=active]:text-slate-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Account
                    </TabsTrigger>
                    <TabsTrigger
                        value="auctions"
                        className="whitespace-nowrap shrink-0 rounded-none border-b-2 border-transparent px-4 sm:px-6 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-300 data-[state=active]:border-slate-200 data-[state=active]:text-slate-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Auctions
                    </TabsTrigger>
                    <TabsTrigger
                        value="bids"
                        className="whitespace-nowrap shrink-0 rounded-none border-b-2 border-transparent px-4 sm:px-6 pb-3 pt-2 font-medium text-slate-500 hover:text-slate-300 data-[state=active]:border-slate-200 data-[state=active]:text-slate-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Bids
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <ProfileAccountTab userId={session.user.id} currentUsername={session.user.username}/>
                </TabsContent>

                <TabsContent value="auctions">
                    <ProfileAuctionsTab auctions={myAuctions} isLoading={isLoadingAuctions} />
                </TabsContent>

                <TabsContent value="bids">
                    <ProfileBidsTab bids={myBids} isLoading={isLoadingBids} />
                </TabsContent>
            </Tabs>
        </div>
    );
}