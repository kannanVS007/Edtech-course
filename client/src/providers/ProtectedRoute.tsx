'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading && !user) {
            if (!['/login', '/register', '/'].includes(pathname)) {
                router.push('/login');
            }
        }
    }, [user, loading, router, pathname, mounted]);

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-vh-100 bg-background text-foreground">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
