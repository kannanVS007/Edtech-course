'use client';

import React from 'react';
import { Sun, Moon, Bell, Search, Globe, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';

export const TopBar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
    const { setTheme, theme } = useTheme();
    const { language, setLanguage, t } = useLanguageStore();
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-background/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-premium glass">
            {/* Mobile Menu Toggle */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2.5 mr-2 bg-surface/50 border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all active:scale-90"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Search - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:flex items-center flex-1 max-w-md lg:max-w-xl pr-4">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-2.5 bg-surface/50 border border-border rounded-2.5xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-sm placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            {/* Mobile Search Icon Only - Hidden if Menu is visible or just kept for symmetry */}
            <div className="flex md:hidden items-center group">
                <button className="p-2.5 bg-surface/50 border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all">
                    <Search className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
                {/* Language Switch */}
                <button
                    onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl border border-border hover:bg-surface hover:border-primary/30 transition-all font-bold text-[10px] sm:text-xs tracking-widest"
                >
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">{language === 'en' ? 'ENGLISH' : 'TAMIL'}</span>
                    <span className="inline sm:hidden">{language === 'en' ? 'EN' : 'TA'}</span>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2.5 sm:p-3 bg-surface/50 border border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-glow transition-all"
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 h-5" /> : <Moon className="w-4 h-4 sm:w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="p-2.5 sm:p-3 bg-surface/50 border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all relative">
                    <Bell className="w-4 h-4 sm:w-5 h-5" />
                    <span className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full border-2 border-background shadow-glow" />
                </button>

                <div className="hidden sm:block h-8 w-[1px] bg-border mx-1" />

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-black tracking-tight leading-tight truncate max-w-[150px]">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold truncate max-w-[150px]">{user?.email}</p>
                        <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] opacity-80 mt-0.5">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm border-2 border-background shadow-premium-xl ring-1 ring-primary/10">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};
