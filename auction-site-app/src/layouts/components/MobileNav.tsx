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
    onChange: (event: ChangeEvent) => void
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
                        onChange={onChange}
                        className="flex gap-2"
                    >
                        <Input 
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(
                                element =>
                                setQuery(element.target.value)
                            )}
                            className="text-indigo-100"
                        />
                        <Button type="submit" className="text-indigo-300">Search</Button>
                    </form>

                    {session ? (
                        <>
                            <Link to="/auctions/create">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Create Auction
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    Profile
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="w-full justify-start text-red-600"
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