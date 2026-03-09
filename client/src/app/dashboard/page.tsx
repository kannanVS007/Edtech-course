'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Award, BookOpen, CheckCircle, TrendingUp, ArrowRight, GraduationCap } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import api from '@/lib/axios';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/auth/stats');
                setStatsData(response.data.data.stats);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Completed Courses', value: statsData?.completedCourses || '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Learning Hours', value: statsData?.learningHours || '0h', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Certificates', value: statsData?.certificates || '0', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Active Courses', value: statsData?.activeCourses || '0', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'Learner'}! 👋</h1>
                        <p className="text-muted-foreground mt-1 font-medium">You've completed 75% of your weekly goal. Keep it up!</p>
                    </div>
                    <button className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
                        <Play className="w-4 h-4 fill-current" /> Continue Learning
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="flex items-center gap-6 group hover:border-primary/30 transition-all">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Current Course */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">In Progress</h2>
                        <Card className="p-0 overflow-hidden group">
                            <div className="relative h-64 w-full">
                                <Image
                                    src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                                    alt="Course"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 z-10" />
                                <div className="absolute bottom-6 left-6 z-20 space-y-2">
                                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest">Development</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">Advanced Next.js & TypeScript</h3>
                                    <p className="text-white/70 font-bold">Module 4: Performance Optimization & SEO</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center text-sm mb-2 font-bold uppercase tracking-tight">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="text-primary text-lg">72%</span>
                                </div>
                                <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '72%' }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-primary shadow-lg shadow-primary/30"
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">+12</div>
                                    </div>
                                    <button className="font-bold text-primary hover:underline underline-offset-4 flex items-center gap-2">
                                        Resume Module <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Content: Recent Activity */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                        <Card className="max-h-[500px] overflow-y-auto space-y-6">
                            {[
                                { title: 'Passed Mini Quiz', time: '2 hours ago', icon: TrendingUp, color: 'text-green-500' },
                                { title: 'New Course Enrolled', time: '4 hours ago', icon: BookOpen, color: 'text-blue-500' },
                                { title: 'Commented on Lesson 4', time: 'Yesterday', icon: GraduationCap, color: 'text-purple-500' },
                                { title: 'Earned Badge: Speed Learner', time: '2 days ago', icon: Award, color: 'text-orange-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0">
                                    <div className="p-2 rounded-xl bg-surface border border-border mt-1">
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm leading-tight hover:text-primary cursor-pointer transition-colors">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-3 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-surface hover:text-primary transition-all">
                                View All Activity
                            </button>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
