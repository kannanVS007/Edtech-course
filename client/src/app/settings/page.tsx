'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, User, Bell, Lock, Moon, Sun, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from 'next-themes';

const SETTING_SECTIONS = [
    {
        title: 'Account', icon: User, items: [
            { label: 'Full Name', value: 'VS Kannan', type: 'text' },
            { label: 'Email', value: 'vskannan@example.com', type: 'email' },
        ]
    },
    {
        title: 'Preferences', icon: Globe, items: [
            { label: 'Language', value: 'English / Tamil', type: 'select' },
            { label: 'Notifications', value: 'Enabled', type: 'toggle' },
        ]
    },
    {
        title: 'Security', icon: Lock, items: [
            { label: 'Change Password', value: '••••••••', type: 'password' },
            { label: 'Two-Factor Auth', value: 'Disabled', type: 'toggle' },
        ]
    },
];

export default function SettingsPage() {
    const { user } = useAuthStore();
    const { language, setLanguage } = useLanguageStore();
    const { theme, setTheme } = useTheme();

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" /> Settings
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your account and preferences</p>
                </div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card hoverable={false} className="flex items-center gap-6 p-8">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-primary/20">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-background border-2 border-border rounded-full flex items-center justify-center hover:bg-surface transition-all">
                                <User className="w-3 h-3 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-extrabold">{user?.name || 'User'}</h2>
                            <p className="text-muted-foreground font-medium">{user?.email || 'user@example.com'}</p>
                            <Badge variant="primary" size="sm" className="mt-2">{user?.role || 'user'}</Badge>
                        </div>
                        <Button variant="outline" size="sm">Edit Profile</Button>
                    </Card>
                </motion.div>

                {/* Setting Sections */}
                {SETTING_SECTIONS.map((section, si) => (
                    <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
                        <Card hoverable={false} className="p-0 overflow-hidden">
                            <div className="px-8 py-5 border-b border-border flex items-center gap-3">
                                <section.icon className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-lg">{section.title}</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {section.items.map((item, ii) => (
                                    <div key={ii} className="flex items-center justify-between px-8 py-5">
                                        <div>
                                            <p className="font-semibold text-sm">{item.label}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5">{item.value}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                                            Edit <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Theme & Language Quick Toggle */}
                <Card hoverable={false} className="flex flex-col sm:flex-row gap-6 p-8">
                    <div className="flex-1">
                        <h4 className="font-bold mb-1 flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                            Theme
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">Current: {theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
                        <div className="flex gap-2">
                            {['light', 'dark', 'system'].map((t) => (
                                <button key={t} onClick={() => setTheme(t)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-all ${theme === t ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-border hover:border-primary/30 text-muted-foreground'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-px bg-border hidden sm:block" />
                    <div className="flex-1">
                        <h4 className="font-bold mb-1 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" /> Language
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">Select your preferred language</p>
                        <div className="flex gap-2">
                            {[['en', 'English'], ['ta', 'தமிழ்']].map(([code, label]) => (
                                <button key={code} onClick={() => setLanguage(code as 'en' | 'ta')}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${language === code ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-border hover:border-primary/30 text-muted-foreground'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end pb-8">
                    <Button variant="danger" size="sm">Delete Account</Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
