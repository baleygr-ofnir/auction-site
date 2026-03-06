import { type ChangeEvent, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import type { UserLoginResponse } from '@/types/user';

interface MobileNavProps {
    session: UserLoginResponse | null;
    logout: () => void;
    query: string;
    setQuery: (value: string) => void;
    onSearch: (event: SubmitEvent) => void;
    onChange: (event: ChangeEvent) => void;
}

export function MobileNav({
    session,
    logout,
    query,
    setQuery,
    onSearch,
    onChange
}: MobileNavProps) {
    return (
        <div className="xl:hidden bg-slate-1000">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <Menu className="h-5 w-5 text-slate-400" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="flex flex-col gap-4 pt-10 bg-slate-950"
                >
                    <SheetTitle className="sr-only text-slate-400">Navigation Menu</SheetTitle>
                    <br />
                    <form
                        onSubmit={onSearch}
                        onChange={(event) => setQuery(event.target.value)}
                        className="flex gap-2"
                    >
                        <Input 
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={onChange}
                            className="text-slate-100"
                        />
                        <Button
                            type="submit"
                            className="text-slate-300"
                        >Search</Button>
                    </form>

                    {session ? (
                        <>
                            {session.user.isAdmin && (
                                <Link to="/admin">
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-start bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 border border-indigo-500/20"
                                    >
                                        Admin Dashboard
                                    </Button>
                                </Link>
                            )}
                            
                            <Link to="/auctions/create">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 border border-indigo-500/2"
                                >
                                    Create Auction
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 border border-indigo-500/2"
                                >
                                    Profile
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="w-full justify-start text-red-400"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}