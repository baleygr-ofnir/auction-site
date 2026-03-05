import { type ChangeEvent, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserLoginResponse } from '@/types/user';

interface DesktopNavProps {
    session: UserLoginResponse | null;
    logout: () => void;
    query: string;
    setQuery: (value: string) => void;
    onSearch: (event: SubmitEvent) => void;
    onChange: (event: ChangeEvent) => void;
}

export function DesktopNav({
    session,
    logout,
    query,
    setQuery,
    onSearch,
    onChange
}: DesktopNavProps) {
    return (
        <div className="hidden xl:flex items-center w-full h-full">
            <form
                onSubmit={onSearch}
                onChange={onChange}
                className="absolute left-1/2 -translate-x-1/2 flex w-full max-w-sm gap-2 z-10"
            >
                <Input 
                  type="text" 
                  placeholder="Search auctions by title..." 
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-slate-950 border-slate-800 rounded-md px-3 py-1 text-indigo-100 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Button type="submit" className="bg-slate-800 px-4 py-1 rounded-md text-indigo-400 text-sm hover:bg-slate-700 transition-colors whitespace-nowrap">Search</Button>
            </form>
          <div className="ml-auto flex items-center gap-4">
              {session ? (
                  <>
                      <Link to="/auctions/create">
                          <Button variant="outline">Create Auction</Button>
                      </Link>
                      <Link to="/profile">
                          <Button variant="ghost">Profile</Button>
                      </Link>
                      <Button className="text-red-600" variant="ghost" onClick={logout}>Logout</Button>
                  </>
              ) : (
                  <>
                      <Link to="/login">
                          <Button variant="ghost">Login</Button>
                      </Link>
                      <Link to="/register">
                          <Button variant="outline">Register</Button>
                      </Link>
                  </>
              )} 
          </div>
          
        </div>
    );
}