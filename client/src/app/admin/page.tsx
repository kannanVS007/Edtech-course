'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Users, BookOpen, Tags, Play, TrendingUp, CheckCircle,
    Activity, Download, BarChart3
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import AdminCategoriesPage from '@/components/admin/AdminCategories';
import AdminCoursesPage from '@/components/admin/AdminCourses';
import AdminUsersPage from '@/components/admin/AdminUsers';
import AdminModulesPage from '@/components/admin/AdminModules';
import api from '@/lib/axios';

const KPI_DATA = [
    { label: 'Total Users', value: '5,240', change: '+12%', icon: Users, color: 'text-primary bg-primary/10', up: true },
    { label: 'Active Courses', value: '48', change: '+3 this month', icon: BookOpen, color: 'text-green-500 bg-green-500/10', up: true },
    { label: 'Revenue', value: '₹1.2L', change: '+18%', icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10', up: true },
    { label: 'Quizzes Taken', value: '12,480', change: '+8%', icon: Activity, color: 'text-purple-500 bg-purple-500/10', up: true },
];

const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: Play },
    { id: 'users', label: 'Users', icon: Users },
];

import { useSearchParams } from 'next/navigation';

export default function AdminPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [stats, setStats] = useState({ totalUsers: '...', activeCourses: '48', revenue: '₹1.2L', quizzes: '12,480' });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/users?limit=1');
                const total = response.data?.data?.totalUsers ?? 0;
                setStats(prev => ({ ...prev, totalUsers: total.toLocaleString() }));
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
                setStats(prev => ({ ...prev, totalUsers: '0' }));
            }
        };
        fetchStats();
    }, []);

    const updatedKpiData = [
        { label: 'Total Users', value: stats.totalUsers, change: '+12%', icon: Users, color: 'text-primary bg-primary/10', up: true },
        { label: 'Active Courses', value: stats.activeCourses, change: '+3 this month', icon: BookOpen, color: 'text-green-500 bg-green-500/10', up: true },
        { label: 'Revenue', value: stats.revenue, change: '+18%', icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10', up: true },
        { label: 'Quizzes Taken', value: stats.quizzes, change: '+8%', icon: Activity, color: 'text-purple-500 bg-purple-500/10', up: true },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 font-outfit uppercase">
                            <Shield className="w-8 h-8 text-primary" /> Admin Panel
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium italic">Elite control for the Skiller ecosystem. Total: <span className="text-primary font-bold">{stats.totalUsers}</span> users found.</p>
                    </div>
                    <Button variant="outline" className="gap-2 font-bold uppercase tracking-widest text-xs">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>

                {/* KPI Summary (always visible) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {updatedKpiData.map((kpi, idx) => (
                        <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                            <Card className="group hover:border-primary/30 p-5 shadow-premium glass">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                                        <kpi.icon className="w-5 h-5" />
                                    </div>
                                    <Badge variant={kpi.up ? 'success' : 'danger'} size="sm" className="font-bold tracking-tighter">{kpi.change}</Badge>
                                </div>
                                <p className="text-2xl font-black font-outfit">{kpi.value}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{kpi.label}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 p-1.5 bg-surface border border-border rounded-2xl overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Enrollments */}
                            <Card hoverable={false} className="p-0 overflow-hidden">
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <h3 className="font-bold text-lg">Recent Enrollments</h3>
                                    <button className="text-sm font-bold text-primary hover:underline">View All</button>
                                </div>
                                <div className="divide-y divide-border">
                                    {[
                                        { user: 'Priya R', course: 'Next.js Mastery', time: '2h ago', amount: 'Free' },
                                        { user: 'Raj K', course: 'Python Data Science', time: '4h ago', amount: '₹999' },
                                        { user: 'Anitha M', course: 'UI/UX Design', time: 'Yesterday', amount: 'Free' },
                                        { user: 'Suresh V', course: 'Docker & K8s', time: '2 days ago', amount: '₹1,999' },
                                    ].map((e, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 hover:bg-surface/50 transition-colors">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                {e.user.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{e.user}</p>
                                                <p className="text-xs text-muted-foreground truncate">{e.course}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className={`text-sm font-bold ${e.amount === 'Free' ? 'text-green-500' : 'text-foreground'}`}>{e.amount}</p>
                                                <p className="text-xs text-muted-foreground">{e.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Platform Health */}
                            <Card hoverable={false} className="p-0 overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h3 className="font-bold text-lg">Platform Health</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[
                                        { label: 'Server Uptime', value: '99.9%', status: 'success' as const },
                                        { label: 'Database Status', value: 'Connected', status: 'success' as const },
                                        { label: 'CDN Status', value: 'Active', status: 'success' as const },
                                        { label: 'Email Service', value: 'Online', status: 'success' as const },
                                        { label: 'Payment Gateway', value: 'Active', status: 'success' as const },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="font-semibold text-sm">{item.label}</span>
                                            </div>
                                            <Badge variant={item.status} size="sm">{item.value}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'categories' && <AdminCategoriesPage />}
                    {activeTab === 'courses' && <AdminCoursesPage />}
                    {activeTab === 'modules' && <AdminModulesPage />}
                    {activeTab === 'users' && <AdminUsersPage />}
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
