'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

export const Card = ({ children, className, hoverable = true }: CardProps) => {
    return (
        <motion.div
            whileHover={hoverable ? { y: -5 } : {}}
            className={cn(
                'bg-background border border-border rounded-[2rem] p-6 shadow-premium transition-colors hover:border-primary/20',
                className
            )}
        >
            {children}
        </motion.div>
    );
};
