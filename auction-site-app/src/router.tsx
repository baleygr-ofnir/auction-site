import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuctionsPage from '@/pages/AuctionsPage';
import AuctionPage from '@/pages/AuctionPage';
import MainLayout from "@/layouts/MainLayout.tsx";
//import { ProtectedRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />, // The parent layout
        children: [
            {
                index: true, // This makes AuctionsPage show up at "/"
                element: <Navigate to="/auctions" replace />,
            },
            {
                path: "auctions",
                element: <AuctionsPage />,
            },
            {
                path: "auctions/:id",
                element: <AuctionPage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            }
            // ... Admin and Catch-all routes
        ],
    },
]);