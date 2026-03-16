import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from "@/layouts/MainLayout";
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuctionsPage from '@/pages/AuctionsPage';
import AuctionPage from '@/pages/AuctionPage';
import CreateAuctionPage from '@/pages/CreateAuctionPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import EditAuctionPage from '@/pages/EditAuctionPage';
import {ProtectedRoute} from '@/components/ProtectedRoute';
import AuctionOwnerGuard from '@/components/AuctionOwnerGuard';
import {editAuctionLoader} from '@/lib/auth-check';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <AuctionsPage />  },
            {
                path: "auctions",
                children: [
                    { index: true, element: <Navigate to="/" replace /> },
                    {
                        path: "create",
                        element: (
                            <ProtectedRoute>
                                <CreateAuctionPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ":id",
                        children: [
                            { index: true, element: <AuctionPage /> },
                            {
                                loader: editAuctionLoader,
                                element: <AuctionOwnerGuard />,
                                children: [
                                    { path: "edit", element: <EditAuctionPage /> }
                                ]
                            },
                        ]
                    },
                ]
            },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute requireAdmin>
                        <AdminPage />
                    </ProtectedRoute>
                )
            },
        ],
    },
]);