'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Users, Star, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor: string;
    price: number;
    totalModules: number;
    category?: { name: string };
    language?: 'English' | 'Tamil' | 'Both';
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    rating?: number;
    enrolledCount?: number;
    duration?: string;
    progress?: number; // For "my courses" view
}

interface CourseCardProps {
    course: Course;
    showProgress?: boolean;
    index?: number;
}

export const CourseCard = ({ course, showProgress = false, index = 0 }: CourseCardProps) => {
    const levelColors: Record<string, 'success' | 'warning' | 'danger'> = {
        Beginner: 'success',
        Intermediate: 'warning',
        Advanced: 'danger',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="group bg-background border border-border rounded-[2rem] overflow-hidden shadow-premium hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            {/* Thumbnail */}
            <Link href={`/courses/${course._id}`} className="relative block aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={`Thumbnail for ${course.title}`}
                        fill
                        priority={index < 3}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                    </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                    </div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg ${course.price === 0 ? 'bg-green-500 text-white' : 'bg-background text-primary border border-primary/30'
                        }`}>
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {course.category && (
                        <Badge variant="primary" size="sm">{course.category.name}</Badge>
                    )}
                    {course.level && (
                        <Badge variant={levelColors[course.level] || 'neutral'} size="sm">{course.level}</Badge>
                    )}
                    {course.language && (
                        <Badge variant="neutral" size="sm">
                            {course.language === 'Tamil' ? '🇮🇳 Tamil' : course.language === 'Both' ? '🌐 Bilingual' : '🇬🇧 English'}
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <Link href={`/courses/${course._id}`}>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {course.title}
                    </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{course.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.totalModules} modules
                    </span>
                    {course.duration && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                        </span>
                    )}
                    {course.enrolledCount !== undefined && (
                        <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {course.enrolledCount.toLocaleString()}
                        </span>
                    )}
                    {course.rating !== undefined && (
                        <span className="flex items-center gap-1.5 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {course.rating.toFixed(1)}
                        </span>
                    )}
                </div>

                {/* Progress bar (for my-courses) */}
                {showProgress && course.progress !== undefined && (
                    <div className="mb-4">
                        <ProgressBar value={course.progress} label="Progress" />
                    </div>
                )}

                {/* Divider */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {course.instructor.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground truncate max-w-[120px]">{course.instructor}</span>
                    </div>
                    <Link
                        href={`/courses/${course._id}`}
                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
                    >
                        {showProgress ? 'Continue' : 'View Course'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
