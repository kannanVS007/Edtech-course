'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-surface overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
