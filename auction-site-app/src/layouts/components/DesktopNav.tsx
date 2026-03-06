// Libraries
import { type ChangeEvent, type SubmitEvent } from 'react';
// Custom types
import type { UserLoginResponse } from '@/types/user';
// Reusable UI components
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
                onChange={(event) => setQuery(event.target.value)} 
                className="absolute left-1/2 -translate-x-1/2 flex w-full max-w-sm gap-2 z-10"
            >
                <Input 
                  type="text" 
                  placeholder="Search auctions by title..." 
                  value={query}
                  onChange={onChange} 
                  className="w-full bg-slate-950 border-slate-800 rounded-md px-3 py-1 text-slate-100 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Button type="submit" className="bg-slate-800 px-4 py-1 rounded-md text-slate-300 text-sm hover:bg-indigo-700 hover:text-indigo-400 transition-colors whitespace-nowrap">Search</Button>
            </form>
          <div className="ml-auto flex items-center gap-4">
              {session ? (
                  <>
                      <Link to="/auctions/create">
                          <Button
                              variant="outline"
                              className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                          >
                              Create Auction
                          </Button>
                      </Link>

                      {session.user.isAdmin && (
                          <Link to="/admin">
                              <Button
                                  variant="ghost"
                                  className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                              >
                                  Admin
                              </Button>
                          </Link>
                      )} 
                      
                      <Link to="/profile">
                          <Button 
                              variant="ghost"
                              className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30"
                          >
                              Profile
                          </Button>
                      </Link>
                      <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={logout}
                      >
                          Logout
                      </Button>
                  </>
              ) : (
                  <>
                      <Link to="/login">
                          <Button 
                              variant="ghost"
                              className="text-indigo-400 hover:text-indigo-300"
                          >Login</Button>
                      </Link>
                      <Link to="/register">
                          <Button
                              variant="outline"
                              className="text-indigo-400 hover:text-indigo-300"
                          >Register</Button>
                      </Link>
                  </>
              )} 
          </div>
          
        </div>
    );
}