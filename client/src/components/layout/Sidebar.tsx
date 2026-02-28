'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    BarChart3,
    Bookmark,
    Shield
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';

export const Sidebar = ({
    collapsed,
    setCollapsed,
    isMobileOpen,
    setIsMobileOpen
}: {
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (o: boolean) => void;
}) => {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();
    const { t } = useLanguageStore();
    const router = useRouter();

    const menuItems = [
        { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Home', icon: BookOpen, path: '/' },
        { name: t('courses'), icon: BookOpen, path: '/my-courses' },
        { name: t('allCourses'), icon: GraduationCap, path: '/courses' },
        { name: t('quizzes'), icon: BarChart3, path: '/quizzes' },
        { name: t('bookmarks'), icon: Bookmark, path: '/bookmarks' },
        { name: t('settings'), icon: Settings, path: '/settings' },
    ];

    if (user?.role === 'admin') {
        const adminItem = { name: t('adminPanel'), icon: Shield, path: '/admin' };
        if (!menuItems.some(i => i.path === '/admin')) {
            menuItems.splice(1, 0, adminItem);
        }
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    width: collapsed ? 80 : 280,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`
                    fixed lg:sticky top-0 left-0 h-screen bg-background border-r border-border 
                    flex flex-col z-50 shadow-premium glass transition-colors
                    ${!isMobileOpen ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className={`h-20 flex items-center ${collapsed ? 'justify-center px-0' : 'px-6'} gap-3 border-b border-border mb-4 overflow-hidden`}>
                    <div className="relative w-10 h-10 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Become A Skiller Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col h-10 justify-center"
                        >
                            <span className="text-sm font-medium leading-tight text-foreground/70 -mb-1">Become A</span>
                            <span className="text-xl font-black text-primary leading-tight tracking-premium font-outfit">Skiller</span>
                        </motion.div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} onClick={() => setIsMobileOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group
                      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}
                    `}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                    {(!collapsed || isMobileOpen) && <span className="truncate">{item.name}</span>}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-3 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {(!collapsed || isMobileOpen) && <span>{t('logout')}</span>}
                    </button>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex mt-2 w-full items-center justify-center p-2 rounded-xl border border-border hover:bg-surface text-muted-foreground"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

