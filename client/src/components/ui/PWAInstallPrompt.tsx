'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only show if not already installed and on mobile-ish screen
            if (window.innerWidth < 1024) {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-4 right-4 z-[90] md:left-auto md:right-8 md:w-96"
                >
                    <div className="bg-background/80 backdrop-blur-2xl border border-primary/20 shadow-premium-xl rounded-3xl p-5 flex items-center gap-4 glass ring-1 ring-primary/10">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-1">Add to Home</h4>
                            <p className="text-xs font-bold text-muted-foreground leading-tight truncate">
                                Install **Become A Skiller** for an elite mobile experience.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstall}
                                className="p-3 bg-primary text-white rounded-xl shadow-glow hover:scale-105 transition-all"
                                aria-label="Install App"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-3 hover:bg-surface rounded-xl transition-all"
                                aria-label="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
