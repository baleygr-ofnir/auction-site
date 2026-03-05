import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DesktopNav } from '@/layouts/components/DesktopNav'
import { MobileNav } from '@/layouts/components/MobileNav';
import { useAuth } from '@/context/AuthContext';

export default function MainLayout() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { session, logout } = useAuth();
    
    const handleSearch = (event: ChangeEvent | SubmitEvent) => {
        event.preventDefault();
        if (query.trim() !== '') {
            navigate(`/auctions?search=${encodeURIComponent(query)}`);
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-6 h-16 border-b border-slate-900 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                {/* Logo / Brand */}
                <Link to="/auctions" className="font-bold text-xl">Auction Site</Link>

                {/* Desktop Navigation */}
                <DesktopNav
                    session={session}
                    query={query}
                    setQuery={setQuery}
                    onSearch={handleSearch}
                    onChange={handleSearch}
                    logout={logout}
                />

                {/* Mobile Navigation */}
                <MobileNav
                    session={session}
                    query={query}
                    setQuery={setQuery}
                    onSearch={handleSearch}
                    onChange={handleSearch}
                    logout={logout}
                />
            </header>
            
            <main className="grow p-4">
                <Outlet />
            </main>
        </div>
    )
}