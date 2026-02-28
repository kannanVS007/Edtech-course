'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, X, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import api from '@/lib/axios';
import { useLanguageStore } from '@/store/languageStore';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'UI/UX Design', 'Mobile Dev', 'DevOps'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['All', 'English', 'Tamil', 'Both'];

const MOCK_COURSES = [
    {
        _id: '1', title: 'Next.js & TypeScript Mastery', description: 'Build production-ready web apps with Next.js 14 App Router, TypeScript, and modern best practices.', instructor: 'VS Kannan', price: 0, totalModules: 18, category: { name: 'Web Development' }, language: 'Both' as const, level: 'Intermediate' as const, rating: 4.9, enrolledCount: 1240, duration: '24h', thumbnail: '',
    },
    {
        _id: '2', title: 'Python for Data Science', description: 'Master Python, Pandas, NumPy, Matplotlib and machine learning fundamentals for real-world data analysis.', instructor: 'Priya R', price: 999, totalModules: 24, category: { name: 'Data Science' }, language: 'Tamil' as const, level: 'Beginner' as const, rating: 4.7, enrolledCount: 980, duration: '32h', thumbnail: '',
    },
    {
        _id: '3', title: 'UI/UX Design Fundamentals', description: 'Learn Figma, design systems, user research, and prototyping. Create stunning, user-centric interfaces.', instructor: 'Anitha M', price: 0, totalModules: 14, category: { name: 'UI/UX Design' }, language: 'English' as const, level: 'Beginner' as const, rating: 4.8, enrolledCount: 2100, duration: '16h', thumbnail: '',
    },
    {
        _id: '4', title: 'React Native Mobile Dev', description: 'Build cross-platform mobile apps for iOS and Android using React Native, Expo, and TypeScript.', instructor: 'Raj K', price: 1499, totalModules: 22, category: { name: 'Mobile Dev' }, language: 'Both' as const, level: 'Intermediate' as const, rating: 4.6, enrolledCount: 750, duration: '28h', thumbnail: '',
    },
    {
        _id: '5', title: 'Docker & Kubernetes DevOps', description: 'Containerize apps, orchestrate with Kubernetes, and build robust CI/CD pipelines for production.', instructor: 'Suresh V', price: 1999, totalModules: 20, category: { name: 'DevOps' }, language: 'English' as const, level: 'Advanced' as const, rating: 4.8, enrolledCount: 460, duration: '30h', thumbnail: '',
    },
    {
        _id: '6', title: 'Machine Learning A-Z Tamil', description: 'கற்றுக்கொள்வோம் Machine Learning - Python-ல் supervised, unsupervised learning algorithms ஐ புரிந்துகொள்ளுங்கள்.', instructor: 'Mani S', price: 799, totalModules: 30, category: { name: 'Data Science' }, language: 'Tamil' as const, level: 'Advanced' as const, rating: 4.9, enrolledCount: 620, duration: '40h', thumbnail: '',
    },
];

export default function CoursesPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { t } = useLanguageStore();

    const filtered = MOCK_COURSES.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCategory === 'All' || c.category?.name === selectedCategory;
        const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
        const matchLang = selectedLanguage === 'All' || c.language === selectedLanguage;
        return matchSearch && matchCat && matchLevel && matchLang;
    });

    const hasFilters = selectedCategory !== 'All' || selectedLevel !== 'All' || selectedLanguage !== 'All' || search;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Hero Header */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary to-primary-dark p-10 text-white">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold mb-3">{t('exploreCourses')}</h1>
                        <p className="text-white/75 text-lg font-medium">{t('heroDesc')}</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {[CATEGORIES, LEVELS, LANGUAGES].map((options, i) => {
                                const values = [selectedCategory, selectedLevel, selectedLanguage];
                                const setters = [setSelectedCategory, setSelectedLevel, setSelectedLanguage];
                                const labels = [t('category'), t('level'), t('languageLabel')];
                                return (
                                    <div key={i} className="relative">
                                        <select
                                            value={values[i]}
                                            onChange={(e) => setters[i](e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-3.5 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold cursor-pointer transition-all"
                                        >
                                            {options.map((opt) => <option key={opt} value={opt}>{opt === 'All' ? `All ${labels[i]}` : opt}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                );
                            })}
                            <div className="flex bg-background border border-border rounded-2xl overflow-hidden">
                                <button onClick={() => setViewMode('grid')} className={`p-3.5 transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}>
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-3.5 transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}>
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active filters */}
                    {hasFilters && (
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="text-muted-foreground font-medium">{filtered.length} {t('results')}</span>
                            {hasFilters && (
                                <button onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); setSelectedLanguage('All'); }}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-all">
                                    <X className="w-3 h-3" /> {t('clearFilters')}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Course Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Search className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t('noResults')}</h3>
                        <p className="text-muted-foreground">{t('adjustSearch')}</p>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {filtered.map((course, idx) => (
                            <CourseCard key={course._id} course={course} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
