'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkX, Play, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { Card } from '@/components/ui/Card';

const MOCK_BOOKMARKS = [
    { _id: '2', title: 'Python for Data Science', description: 'Master Python, Pandas, NumPy for real-world data analysis.', instructor: 'Priya R', price: 999, totalModules: 24, category: { name: 'Data Science' }, language: 'Tamil' as const, level: 'Beginner' as const, rating: 4.7, enrolledCount: 980, duration: '32h', thumbnail: '' },
    { _id: '5', title: 'Docker & Kubernetes DevOps', description: 'Containerize apps and build robust CI/CD pipelines.', instructor: 'Suresh V', price: 1999, totalModules: 20, category: { name: 'DevOps' }, language: 'English' as const, level: 'Advanced' as const, rating: 4.8, enrolledCount: 460, duration: '30h', thumbnail: '' },
];

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);

    const remove = (id: string) => setBookmarks((prev) => prev.filter((b) => b._id !== id));

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            <Bookmark className="w-8 h-8 text-primary fill-primary" /> Bookmarks
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium">{bookmarks.length} courses saved</p>
                    </div>
                </div>

                {bookmarks.length === 0 ? (
                    <Card className="text-center py-24">
                        <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
                        <p className="text-muted-foreground">Save courses to review them later.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {bookmarks.map((course, idx) => (
                                <motion.div key={course._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.1 }} className="relative group">
                                    <CourseCard course={course} index={idx} />
                                    <button
                                        onClick={() => remove(course._id)}
                                        className="absolute top-4 left-4 z-10 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
                                        title="Remove bookmark"
                                    >
                                        <BookmarkX className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
