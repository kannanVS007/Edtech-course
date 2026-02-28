'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Play, Plus, Pencil, Trash2, Search, GripVertical, Link, Loader2, Youtube, Clock } from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/axios';

const moduleSchema = z.object({
    title: z.string().min(3, 'Title required'),
    youtubeUrl: z.string().min(5, 'Enter YouTube URL or Video ID'),
    order: z.string().regex(/^\d+$/, 'Must be a number'),
});

type ModuleForm = z.infer<typeof moduleSchema>;

export default function AdminModulesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/courses');
            const data = response.data.data.courses;
            setCourses(data);
            if (data.length > 0 && !selectedCourse) {
                setSelectedCourse(data[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCourse]);

    const fetchModules = useCallback(async () => {
        if (!selectedCourse) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/courses/${selectedCourse}`);
            setModules(response.data.data.course.modules || []);
        } catch (error) {
            console.error('Failed to fetch modules', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCourse]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ModuleForm>({
        resolver: zodResolver(moduleSchema),
    });

    const openAdd = () => {
        reset({ order: String(modules.length + 1) });
        setEditTarget(null);
        setIsFormOpen(true);
    };

    const openEdit = (mod: any) => {
        setEditTarget(mod);
        setValue('title', mod.title);
        setValue('youtubeUrl', mod.youtubeUrl);
        setValue('order', String(mod.order));
        setIsFormOpen(true);
    };

    const onSubmit = async (data: ModuleForm) => {
        if (!selectedCourse) return;
        setIsActionLoading(true);
        try {
            const payload = {
                ...data,
                order: Number(data.order),
                course: selectedCourse,
                courseId: courses.find(c => c._id === selectedCourse)?.courseId || '',
            };

            if (editTarget) {
                await api.patch(`/modules/${editTarget._id}`, payload);
            } else {
                await api.post('/modules', payload);
            }
            await fetchModules();
            setIsFormOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save module', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsActionLoading(true);
        try {
            await api.delete(`/modules/${deleteTarget}`);
            await fetchModules();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete module', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const sortedModules = [...modules].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 font-outfit">
                        <Play className="w-8 h-8 text-primary fill-primary" /> Curriculum Architect
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 font-medium font-outfit tracking-tight">
                        Design the learning flow for your masterclasses.
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    disabled={!selectedCourse}
                    className="gap-2 rounded-2xl h-12 shadow-premium hover:shadow-glow transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Lesson
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-surface/30 p-4 rounded-3xl border border-border/50">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap ml-2">Active Masterclass:</label>
                <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="px-5 py-3 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm flex-1 max-w-md shadow-sm transition-all"
                >
                    <option value="" disabled>Select a course...</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-black uppercase tracking-widest text-xs">Syncing Curriculum...</p>
                </div>
            ) : (
                <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-premium divide-y divide-border/50 glass">
                    {sortedModules.length === 0 && (
                        <div className="text-center py-24 text-muted-foreground">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="font-black uppercase tracking-widest text-xs">This curriculum is currently empty.</p>
                            <Button variant="secondary" size="sm" onClick={openAdd} className="mt-6 font-bold">Initialize First Lesson</Button>
                        </div>
                    )}
                    {sortedModules.map((mod) => (
                        <div key={mod._id} className="flex items-center gap-5 px-8 py-5 hover:bg-primary/5 group transition-colors">
                            <div className="text-muted-foreground cursor-grab hover:text-primary transition-colors active:cursor-grabbing">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary font-black text-xs shrink-0 shadow-sm border border-primary/5">
                                {mod.order}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-sm tracking-tight truncate group-hover:text-primary transition-colors">{mod.title}</p>
                                <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Youtube className="w-3 h-3 text-red-500" /> {mod.youtubeUrl}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Duration TBA</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(mod)}
                                    className="p-2.5 bg-primary/10 text-primary rounded-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(mod._id)}
                                    className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editTarget ? 'Refine Lesson' : 'Add New Lesson'} size="lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input label="Lesson Title *" placeholder="e.g. Masterclass Introduction" {...register('title')} error={errors.title?.message} />
                    <Input label="YouTube URL or Video ID *" placeholder="e.g. https://youtube.com/watch?v=..." {...register('youtubeUrl')} error={errors.youtubeUrl?.message} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Waitlist Link (Optional)" placeholder="https://..." value="Coming Soon" disabled />
                        <Input label="Sequence Order *" placeholder="1" {...register('order')} error={errors.order?.message} />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" className="flex-1 rounded-2xl h-12" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1 rounded-2xl h-12 shadow-premium hover:shadow-glow" isLoading={isActionLoading}>
                            {editTarget ? 'Save Changes' : 'Append Lesson'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Archive Lesson?"
                message="This will remove the lesson from the student dashboard. Progress data for this specific lesson will be cleared."
                isLoading={isActionLoading}
            />
        </div>
    );
}
