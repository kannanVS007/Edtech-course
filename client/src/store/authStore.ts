import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => {
                set({ user: null, token: null });
                localStorage.removeItem('token');
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
