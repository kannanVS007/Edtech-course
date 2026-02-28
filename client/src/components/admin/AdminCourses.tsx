'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BookOpen, Plus, Pencil, Trash2, Search, Star, Users, Clock, Eye, Loader2, Globe, TrendingUp } from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/axios';

const courseSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    instructor: z.string().min(2, 'Instructor name required'),
    price: z.string().regex(/^\d+$/, 'Enter a valid price'),
    category: z.string().min(1, 'Select a category'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    language: z.enum(['English', 'Tamil', 'Both']),
    thumbnail: z.string().url('Enter a valid URL').or(z.literal('')),
    courseId: z.string().min(3, 'Course ID is required'),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [coursesRes, catsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/categories')
            ]);
            setCourses(coursesRes.data.data.courses);
            setCategories(catsRes.data.data.categories);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CourseForm>({
        resolver: zodResolver(courseSchema),
        defaultValues: { level: 'Beginner', language: 'English', price: '0', thumbnail: '' },
    });

    const openAdd = () => {
        reset({ level: 'Beginner', language: 'English', price: '0', thumbnail: '' });
        setEditTarget(null);
        setIsFormOpen(true);
    };

    const openEdit = (c: any) => {
        setEditTarget(c);
        setValue('title', c.title);
        setValue('courseId', c.courseId);
        setValue('description', c.description);
        setValue('instructor', c.instructor);
        setValue('price', String(c.price));
        setValue('category', c.category?._id || c.category);
        setValue('level', c.level || 'Beginner');
        setValue('language', c.language || 'English');
        setValue('thumbnail', c.thumbnail || '');
        setIsFormOpen(true);
    };

    const onSubmit = async (data: CourseForm) => {
        setIsActionLoading(true);
        try {
            const payload = { ...data, price: Number(data.price) };
            if (editTarget) {
                await api.patch(`/courses/${editTarget._id}`, payload);
            } else {
                await api.post('/courses', payload);
            }
            await fetchData();
            setIsFormOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save course', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsActionLoading(true);
        try {
            await api.delete(`/courses/${deleteTarget}`);
            await fetchData();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete course', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const toggleStatus = async (course: any) => {
        setIsActionLoading(true);
        try {
            const newStatus = course.status === 'Published' ? 'Draft' : 'Published';
            await api.patch(`/courses/${course._id}`, { status: newStatus });
            await fetchData();
        } catch (error) {
            console.error('Failed to toggle status', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 font-outfit">
                        <BookOpen className="w-8 h-8 text-primary" /> Program Management
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 font-medium font-outfit tracking-tight">
                        Curate and scale your elite curriculum.
                    </p>
                </div>
                <Button onClick={openAdd} className="gap-2 rounded-2xl h-12 shadow-premium hover:shadow-glow transition-all">
                    <Plus className="w-4 h-4" /> Create Course
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search programs..."
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-black uppercase tracking-widest text-xs">Syncing Programs...</p>
                </div>
            ) : (
                <div className="bg-background border border-border rounded-[2rem] overflow-hidden shadow-premium glass">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left bg-surface/50">
                                    {['Course', 'Category', 'Price', 'Stats', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map((course) => (
                                    <tr key={course._id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-surface border border-border overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                                                    <img src={course.thumbnail || '/placeholder-course.jpg'} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-extrabold text-sm tracking-tight truncate">{course.title}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-widest">By {course.instructor}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="neutral" size="sm" className="font-black uppercase tracking-widest text-[9px] px-3">
                                                {course.category?.name || 'Uncategorized'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-black text-sm tracking-tighter ${course.price === 0 ? 'text-green-500' : 'text-foreground'}`}>
                                                {course.price === 0 ? 'FREE' : `₹${course.price}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                    <Users className="w-3 h-3" /> {(course.enrolled || 0).toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                                    <Star className="w-3 h-3 fill-amber-500" /> {course.rating || 'New'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => toggleStatus(course)}
                                                className="transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Badge variant={course.status === 'Published' ? 'success' : 'warning'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                                    {course.status || 'Draft'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(course)}
                                                    className="p-2.5 bg-primary/10 text-primary rounded-xl hover:scale-110 transition-all shadow-sm"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(course._id)}
                                                    className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:scale-110 transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                <p className="font-black uppercase tracking-widest text-xs">No programs found in the database.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editTarget ? 'Edit Masterclass' : 'Create New Masterclass'} size="lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Program Title *" placeholder="e.g. Next.js Mastery" {...register('title')} error={errors.title?.message} />
                        <Input label="Short Course ID *" placeholder="e.g. nextjs-mastery" {...register('courseId')} error={errors.courseId?.message} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Curriculum Overview *</label>
                        <textarea
                            {...register('description')}
                            placeholder="What will skillers master in this program?"
                            rows={3}
                            className="w-full px-5 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-bold text-sm"
                        />
                        {errors.description && <p className="text-xs text-red-500 ml-1 italic">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Lead Instructor *" placeholder="e.g. VS Kannan" {...register('instructor')} error={errors.instructor?.message} />
                        <Input label="Investment (₹, 0 = Scholarship)" placeholder="0" {...register('price')} error={errors.price?.message} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Taxonomy *</label>
                            <select {...register('category')} className="w-full px-4 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm">
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            {errors.category && <p className="text-xs text-red-500 ml-1 italic">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Intensity *</label>
                            <select {...register('level')} className="w-full px-4 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Medium *</label>
                            <select {...register('language')} className="w-full px-4 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm">
                                <option value="English">English</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>
                    <Input label="Cover Image URL" placeholder="https://..." {...register('thumbnail')} error={errors.thumbnail?.message} />
                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" className="flex-1 rounded-2xl h-12" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1 rounded-2xl h-12 shadow-premium hover:shadow-glow" isLoading={isActionLoading}>
                            {editTarget ? 'Save Changes' : 'Initialize Program'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Archive Program?"
                message="This will permanently delete the program and all associated material. This action is irreversible."
                isLoading={isActionLoading}
            />
        </div>
    );
}
