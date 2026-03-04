'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Clock, Users, Star, Play, Check, ChevronDown, ChevronUp,
    ArrowLeft, Globe, Award, Lock, Share2, Bookmark, BookmarkCheck
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

const MOCK_COURSE = {
    _id: '1',
    title: 'Next.js & TypeScript Mastery',
    description: 'Build production-ready web apps with Next.js 14 App Router, TypeScript, and modern best practices. This course covers everything from the fundamentals to advanced topics like server components, streaming, ISR, and deployment.',
    instructor: 'VS Kannan',
    price: 0,
    totalModules: 6,
    category: { name: 'Web Development' },
    language: 'Both',
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: 1240,
    duration: '24h',
    progress: 72,
    whatYoullLearn: [
        'Build full-stack apps with Next.js 14 App Router',
        'Master TypeScript for type-safe development',
        'Implement server-side rendering and SSG',
        'Deploy to Vercel with CI/CD pipelines',
        'API routes and server actions',
        'Authentication with NextAuth.js',
    ],
    modules: [
        { _id: 'm1', title: 'Introduction to Next.js 14', duration: '45 min', youtubeId: 'dQw4w9WgXcQ', completed: true },
        { _id: 'm2', title: 'App Router Deep Dive', duration: '1h 20 min', youtubeId: 'dQw4w9WgXcQ', completed: true },
        { _id: 'm3', title: 'TypeScript with React', duration: '1h 5 min', youtubeId: 'dQw4w9WgXcQ', completed: true },
        { _id: 'm4', title: 'Server Components & Actions', duration: '1h 30 min', youtubeId: 'dQw4w9WgXcQ', completed: false },
        { _id: 'm5', title: 'Performance & Optimization', duration: '55 min', youtubeId: 'dQw4w9WgXcQ', completed: false },
        { _id: 'm6', title: 'Deployment & CI/CD', duration: '40 min', youtubeId: 'dQw4w9WgXcQ', completed: false },
    ],
};

export default function CourseDetailPage() {
    const [activeModule, setActiveModule] = useState(MOCK_COURSE.modules[0]);
    const [expandedModules, setExpandedModules] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);
    const [enrolled, setEnrolled] = useState(true);

    const completedCount = MOCK_COURSE.modules.filter((m) => m.completed).length;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Link href="/courses" className="flex items-center gap-1 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-semibold line-clamp-1">{MOCK_COURSE.title}</span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left: Video Player + Modules */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* YouTube Player */}
                        <div className="rounded-[2rem] overflow-hidden bg-black shadow-2xl">
                            <div className="relative aspect-video">
                                <iframe
                                    key={activeModule._id}
                                    src={`https://www.youtube.com/embed/${activeModule.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                                    title={activeModule.title}
                                    className="w-full h-full"
                                    allowFullScreen
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        </div>

                        {/* Now Playing Info */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex gap-2 mb-2">
                                    <Badge variant="neutral" size="sm">Now Playing</Badge>
                                    <Badge variant="primary" size="sm" className="bg-blue-500/10 text-blue-500 border-none">{MOCK_COURSE.language}</Badge>
                                    <Badge variant="warning" size="sm" className="bg-amber-500/10 text-amber-500 border-none">{MOCK_COURSE.level}</Badge>
                                </div>
                                <h2 className="text-2xl font-bold">{activeModule.title}</h2>
                                <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {activeModule.duration}
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setBookmarked(!bookmarked)}
                                    className="p-3 rounded-2xl border border-border hover:bg-surface hover:border-primary/30 transition-all"
                                >
                                    {bookmarked ? (
                                        <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                                    ) : (
                                        <Bookmark className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </button>
                                <button className="p-3 rounded-2xl border border-border hover:bg-surface transition-all">
                                    <Share2 className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        {enrolled && (
                            <div className="bg-background border border-border rounded-[2rem] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold">Your Progress</h4>
                                    <span className="text-sm text-muted-foreground font-medium">{completedCount}/{MOCK_COURSE.totalModules} modules</span>
                                </div>
                                <ProgressBar value={(completedCount / MOCK_COURSE.totalModules) * 100} />
                            </div>
                        )}

                        {/* What you'll learn */}
                        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" /> What You'll Learn
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {MOCK_COURSE.whatYoullLearn.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-sm font-medium leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Module List + Course Info */}
                    <div className="space-y-6">
                        {/* Module List */}
                        <div className="bg-background border border-border rounded-[2rem] overflow-hidden shadow-premium">
                            <button
                                onClick={() => setExpandedModules(!expandedModules)}
                                className="w-full flex items-center justify-between p-6 font-bold hover:bg-surface transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Course Content ({MOCK_COURSE.totalModules} modules)
                                </span>
                                {expandedModules ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            <AnimatePresence>
                                {expandedModules && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-border divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-hide">
                                            {MOCK_COURSE.modules.map((mod, idx) => {
                                                const isActive = activeModule._id === mod._id;
                                                const isLocked = !enrolled && idx > 1;
                                                return (
                                                    <button
                                                        key={mod._id}
                                                        onClick={() => !isLocked && setActiveModule(mod)}
                                                        disabled={isLocked}
                                                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all hover:bg-surface/80 ${isActive ? 'bg-primary/5 border-l-4 border-primary' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${mod.completed ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-surface text-muted-foreground border border-border'
                                                            }`}>
                                                            {mod.completed ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : ''}`}>{mod.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                                <Play className="w-3 h-3" /> {mod.duration}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Course Info Card */}
                        <div className="bg-background border border-border rounded-[2rem] p-6 space-y-4 shadow-premium">
                            <h3 className="font-bold text-lg">{MOCK_COURSE.title}</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Globe className="w-4 h-4" /> Language</span>
                                    <span className="font-bold">{MOCK_COURSE.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Star className="w-4 h-4" /> Rating</span>
                                    <span className="font-bold text-amber-500">{MOCK_COURSE.rating} ⭐</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Users className="w-4 h-4" /> Students</span>
                                    <span className="font-bold">{MOCK_COURSE.enrolledCount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span>
                                    <span className="font-bold">{MOCK_COURSE.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2"><BookOpen className="w-4 h-4" /> Level</span>
                                    <Badge variant="warning" size="sm">{MOCK_COURSE.level}</Badge>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border">
                                {enrolled ? (
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            const next = MOCK_COURSE.modules.find((m) => !m.completed);
                                            if (next) setActiveModule(next);
                                        }}
                                    >
                                        <Play className="w-4 h-4 fill-white mr-2" /> Continue Learning
                                    </Button>
                                ) : (
                                    <Button className="w-full" onClick={() => setEnrolled(true)}>
                                        {MOCK_COURSE.price === 0 ? '🎓 Enroll for Free' : `💳 Enroll for ₹${MOCK_COURSE.price}`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
