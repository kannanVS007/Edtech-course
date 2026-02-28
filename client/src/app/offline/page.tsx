'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10 text-center"
            >
                <div className="relative w-24 h-24 mx-auto mb-8 group">
                    <div className="absolute inset-0 bg-red-400/20 rounded-3xl blur-xl group-hover:bg-red-400/30 transition-colors" />
                    <div className="relative w-full h-full bg-background border border-border rounded-3xl flex items-center justify-center shadow-premium-xl">
                        <WifiOff className="w-10 h-10 text-red-500 animate-pulse" />
                    </div>
                </div>

                <div className="flex flex-col items-center leading-none mb-6">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Become A</span>
                    <h1 className="text-4xl font-black text-primary tracking-premium font-outfit uppercase">Skiller</h1>
                </div>

                <h2 className="text-2xl font-black mb-4 font-outfit tracking-tight">You're Offline</h2>
                <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                    It seems like you've lost your connection. Don't worry, your progress is saved. Please check your internet and try again.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-3 shadow-premium hover:shadow-glow transition-all"
                    >
                        <RefreshCw className="w-5 h-5" /> Retry Connection
                    </button>
                    <Link
                        href="/"
                        className="w-full py-4 rounded-2xl border-2 border-border font-black text-lg flex items-center justify-center gap-3 hover:bg-surface transition-all"
                    >
                        <Home className="w-5 h-5" /> Back to Home
                    </Link>
                </div>

                <p className="mt-12 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Handcrafted for Excellence.
                </p>
            </motion.div>
        </div>
    );
}
