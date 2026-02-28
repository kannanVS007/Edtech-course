'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, rightElement, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-semibold text-foreground/80 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            'w-full px-5 py-3 rounded-2xl border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                            error ? 'border-red-500 focus:ring-red-500/10' : 'border-border',
                            rightElement && 'pr-12',
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && <p className="text-xs text-red-500 ml-1 italic">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
