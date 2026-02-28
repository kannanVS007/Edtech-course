'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';

const MY_COURSES = [
    { _id: '1', title: 'Next.js & TypeScript Mastery', description: 'Build production-ready web apps with Next.js 14 App Router and TypeScript.', instructor: 'VS Kannan', price: 0, totalModules: 18, category: { name: 'Web Development' }, language: 'Both' as const, level: 'Intermediate' as const, rating: 4.9, enrolledCount: 1240, duration: '24h', thumbnail: '', progress: 72 },
    { _id: '3', title: 'UI/UX Design Fundamentals', description: 'Learn Figma, design systems, user research, and prototyping techniques.', instructor: 'Anitha M', price: 0, totalModules: 14, category: { name: 'UI/UX Design' }, language: 'English' as const, level: 'Beginner' as const, rating: 4.8, enrolledCount: 2100, duration: '16h', thumbnail: '', progress: 35 },
    { _id: '6', title: 'Machine Learning A-Z Tamil', description: 'Python-ல் Machine Learning algorithms ஐ புரிந்துகொள்ளுங்கள்.', instructor: 'Mani S', price: 0, totalModules: 30, category: { name: 'Data Science' }, language: 'Tamil' as const, level: 'Advanced' as const, rating: 4.9, enrolledCount: 620, duration: '40h', thumbnail: '', progress: 12 },
];

export default function MyCoursesPage() {
    const totalProgress = Math.round(MY_COURSES.reduce((sum, c) => sum + (c.progress || 0), 0) / MY_COURSES.length);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">My Courses</h1>
                        <p className="text-muted-foreground mt-1 font-medium">{MY_COURSES.length} courses enrolled</p>
                    </div>
                    <Link href="/courses" className="px-6 py-3 rounded-2xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Browse More
                    </Link>
                </div>

                {/* Overall Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: 'Enrolled', value: MY_COURSES.length, icon: BookOpen, color: 'text-primary bg-primary/10' },
                        { label: 'Avg. Progress', value: `${totalProgress}%`, icon: Trophy, color: 'text-amber-500 bg-amber-500/10' },
                        { label: 'Hours Learned', value: '58h', icon: Clock, color: 'text-green-500 bg-green-500/10' },
                    ].map((item) => (
                        <Card key={item.label} className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{item.value}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Overall Progress */}
                <Card hoverable={false} className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Overall Learning Progress</h3>
                        <span className="text-primary font-bold">{totalProgress}%</span>
                    </div>
                    <ProgressBar value={totalProgress} showValue={false} />
                </Card>

                {/* In Progress */}
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary fill-primary" /> Continue Learning
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MY_COURSES.map((course, idx) => (
                            <CourseCard key={course._id} course={course} showProgress index={idx} />
                        ))}
                    </div>
                </div>

                {/* Explore CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-dark p-10 text-white text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold mb-2">Ready to learn something new?</h3>
                        <p className="text-white/75 mb-6">Explore 100+ courses in Tamil & English.</p>
                        <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl">
                            <BookOpen className="w-5 h-5" /> Explore All Courses
                        </Link>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
