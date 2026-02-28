import React from 'react';

export default function Loading() {
    return (
        <div className="p-8 space-y-12 animate-pulse">
            {/* Hero Skeleton */}
            <div className="h-64 bg-surface-dark rounded-[2.5rem] border border-border/50" />

            {/* Filters Skeleton */}
            <div className="flex gap-4 items-center overflow-x-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-32 bg-surface-dark rounded-xl shrink-0" />
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-48 bg-surface-dark rounded-[2rem]" />
                        <div className="h-6 w-3/4 bg-surface-dark rounded-lg" />
                        <div className="h-4 w-1/2 bg-surface-dark/50 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
