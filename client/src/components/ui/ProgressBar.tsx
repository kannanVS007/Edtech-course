'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    value: number; // 0-100
    label?: string;
    showValue?: boolean;
    color?: 'primary' | 'green' | 'orange';
    className?: string;
}

export const ProgressBar = ({ value, label, showValue = true, color = 'primary', className }: ProgressBarProps) => {
    const colors = {
        primary: 'bg-primary shadow-primary/30',
        green: 'bg-green-500 shadow-green-500/30',
        orange: 'bg-orange-500 shadow-orange-500/30',
    };

    return (
        <div className={className}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                    {label && <span className="text-muted-foreground uppercase tracking-wide text-xs">{label}</span>}
                    {showValue && <span className="text-primary">{Math.round(value)}%</span>}
                </div>
            )}
            <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full rounded-full shadow-lg ${colors[color]}`}
                />
            </div>
        </div>
    );
};
