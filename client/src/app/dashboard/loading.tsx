import React from 'react';

export default function Loading() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-surface-dark rounded-xl" />
                    <div className="h-4 w-48 bg-surface-dark/50 rounded-lg" />
                </div>
                <div className="h-12 w-40 bg-surface-dark rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-surface-dark rounded-[2rem] border border-border/50" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[400px] bg-surface-dark rounded-[2.5rem]" />
                <div className="h-[400px] bg-surface-dark rounded-[2.5rem]" />
            </div>
        </div>
    );
}
