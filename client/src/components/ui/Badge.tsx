'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge = ({ children, variant = 'primary', size = 'md', className }: BadgeProps) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
        warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
        danger: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
        neutral: 'bg-surface text-muted-foreground border-border',
    };
    const sizes = {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-3 py-1 text-xs',
    };
    return (
        <span className={cn('inline-flex items-center font-semibold rounded-full border', variants[variant], sizes[size], className)}>
            {children}
        </span>
    );
};
