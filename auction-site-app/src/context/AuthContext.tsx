import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { setAuthToken } from '@/lib/client';
import type { UserLoginResponse, UserResponse } from '@/types/user';

interface AuthContextValue {
    session: UserLoginResponse | null;
    login: (response: UserLoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY= 'auction-auth';

function loadInitialState(): UserLoginResponse | null {
    if (typeof window === 'undefined') return null;
    
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        
        return JSON.parse(raw) as UserLoginResponse;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<UserLoginResponse | null>(() => loadInitialState());

    useEffect(() => {
        setAuthToken(session?.token ?? null);
    }, [session?.token]);
    
    const login = (response: UserLoginResponse) => {
        setSession(response);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
        }
    };
    
    const logout = () => {
        setSession(null);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    };
    
    const value: AuthContextValue = {
        session,
        login,
        logout
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    
    return context;
}