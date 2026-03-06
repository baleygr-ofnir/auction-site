// Libraries
import { useEffect, useState } from 'react';
// Custom hooks and services
import userService from '@/services/userService';
import auctionService from '@/services/auctionService';
// Custom types
import type { UserResponse } from '@/types/user';
import type { AuctionListItemResponse } from '@/types/auction';
// UI components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { AuctionManagementTable } from '@/components/admin/AuctionManagementTable';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { EyeOff, Gavel, UserMinus } from 'lucide-react';

export function AdminContainer() {
    const [activeTab, setActiveTab] = useState('users'); 
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [auctions, setAuctions] = useState<AuctionListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (isInitialLoad = false) => {
        if (isInitialLoad) setIsLoading(true);
        try {
            const [userData, auctionData] = await Promise.all([
                userService.getAll(),
                auctionService.getAuctions(),
            ]);
            setUsers(userData);
            setAuctions(auctionData);
        } catch (error) {
            console.error('Management data fetch failed', error);
        } finally {
            if (isInitialLoad) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(true);
    }, []);

    const handleDeleteAuction = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action is irreversible.`)) return;

        try {
            await auctionService.delete(id);
            // Local state update for immediate feedback
            setAuctions(previous => previous.filter(auction => auction.id !== id));
        } catch (error) {
            console.error('Auction deletion failed', error);
        }
    };

    // FIXED: Changed made-up loadAuctions() to your existing fetchData()
    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await auctionService.update(id, { isActive: !currentStatus });
            await fetchData(false); // Refresh data to update visibility badges
        } catch (err) {
            console.error("Failed to update auction visibility", err);
        }
    };

    const handleToggleStatus = async (user: UserResponse) => {
        try {
            // Sending ONLY the isActive property as your manual test confirmed works
            await userService.update(user.id, { isActive: !user.isActive });
            await fetchData(false); // AWAIT this so the UI doesn't show old data
        } catch (error) {
            console.error('Update of user failed', error);
        }
    };

    const handleToggleAdmin = async (user: UserResponse) => {
        const confirmed = window.confirm(`Change admin status for ${user.username}?`);
        if (!confirmed) return;

        try {
            await userService.update(user.id, { isAdmin: !user.isAdmin });
            await fetchData(false);
        } catch (error) {
            console.error('Admin toggle failed', error);
        }
    };

    if (isLoading) return <div className="p-8 text-slate-400">Loading Management Dashboard...</div>;

    // Filter data for sections (Cleaned up duplicates)
    const activeUsers = users.filter(u => u.isActive);
    const suspendedUsers = users.filter(u => !u.isActive);
    const activeAuctions = auctions.filter(a => a.isActive);
    const inactiveAuctions = auctions.filter(a => !a.isActive);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
            <header className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-400 flex items-center gap-3">
                    <Gavel className="h-8 w-8 md:h-10 md:w-10" /> Admin Dashboard
                </h1>
                <p className="text-slate-400">Global system management.</p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex w-full justify-start overflow-x-auto border-b border-slate-800 bg-transparent p-0 h-auto rounded-none mb-8 no-scrollbar">
                    <TabsTrigger value="users" className="whitespace-nowrap shrink-0 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-slate-500 data-[state=active]:border-slate-200 data-[state=active]:text-slate-200">
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="auctions" className="whitespace-nowrap shrink-0 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-slate-500 data-[state=active]:border-slate-200 data-[state=active]:text-slate-200">
                        Auctions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-8">
                    <Card className="bg-slate-950 border-slate-800 text-slate-100">
                        <CardHeader><CardTitle className="text-indigo-400">Active Users</CardTitle></CardHeader>
                        <CardContent className="overflow-x-auto">
                            <UserManagementTable
                                users={activeUsers}
                                onToggleStatus={handleToggleStatus}
                                onToggleAdmin={handleToggleAdmin}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800 text-slate-100 opacity-90">
                        <CardHeader>
                            <CardTitle className="text-red-400 flex items-center gap-2">
                                <UserMinus className="h-5 w-5" /> Suspended Accounts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <UserManagementTable
                                users={suspendedUsers}
                                onToggleStatus={handleToggleStatus}
                                onToggleAdmin={handleToggleAdmin}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="auctions" className="space-y-8">
                    <Card className="bg-slate-950 border-slate-800 text-slate-100">
                        <CardHeader><CardTitle className="text-indigo-400">Active Listings</CardTitle></CardHeader>
                        <CardContent className="overflow-x-auto">
                            <AuctionManagementTable
                                auctions={activeAuctions}
                                onDelete={handleDeleteAuction}
                                onToggleActive={handleToggleActive}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800 text-slate-100 opacity-90">
                        <CardHeader>
                            <CardTitle className="text-slate-400 flex items-center gap-2">
                                <EyeOff className="h-5 w-5" /> Inactive Listings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <AuctionManagementTable
                                auctions={inactiveAuctions}
                                onDelete={handleDeleteAuction}
                                onToggleActive={handleToggleActive}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}