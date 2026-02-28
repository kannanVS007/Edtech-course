'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tags, Plus, Pencil, Trash2, Tag, Search, Loader2 } from 'lucide-react';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import api from '@/lib/axios';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    slug: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<any | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryForm>({
        resolver: zodResolver(categorySchema),
    });

    const openAdd = () => { reset(); setEditTarget(null); setIsFormOpen(true); };
    const openEdit = (cat: any) => {
        setEditTarget(cat);
        setValue('name', cat.name);
        setValue('slug', cat.slug);
        setValue('description', cat.description);
        setIsFormOpen(true);
    };

    const onSubmit = async (data: CategoryForm) => {
        setIsActionLoading(true);
        try {
            const payload = {
                ...data,
                slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
            };

            if (editTarget) {
                await api.patch(`/categories/${editTarget._id}`, payload);
            } else {
                await api.post('/categories', payload);
            }
            await fetchCategories();
            setIsFormOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to save category', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsActionLoading(true);
        try {
            await api.delete(`/categories/${deleteTarget}`);
            await fetchCategories();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete category', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 font-outfit">
                        <Tags className="w-8 h-8 text-primary" /> Category Management
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 font-medium font-outfit tracking-tight">
                        Organize your programs with elite hierarchy.
                    </p>
                </div>
                <Button onClick={openAdd} className="gap-2 rounded-2xl h-12 shadow-premium hover:shadow-glow transition-all">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="font-black uppercase tracking-widest text-xs">Syncing Categories...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cat) => (
                        <Card key={cat._id} hoverable={true} className="group relative overflow-hidden bg-background border-border shadow-premium glass">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center shrink-0 shadow-sm">
                                    <Tag className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-extrabold text-base tracking-tight truncate">{cat.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">SLUG: {cat.slug}</p>
                                </div>
                            </div>
                            {cat.description && <p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed font-medium">{cat.description}</p>}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                                <Badge variant="primary" size="sm" className="font-black uppercase tracking-widest text-[9px] px-3">{cat.coursesCount || 0} courses</Badge>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(cat)}
                                        className="p-2.5 bg-primary/10 text-primary rounded-xl hover:scale-110 transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(cat._id)}
                                        className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:scale-110 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <Tags className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="font-black uppercase tracking-widest text-xs">No categories found in the database.</p>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editTarget ? 'Edit Category' : 'Add New Category'}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Category Name *" placeholder="e.g. Web Development" {...register('name')} error={errors.name?.message} />
                    <Input label="Slug (auto-generated if empty)" placeholder="e.g. web-development" {...register('slug')} error={errors.slug?.message} />
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            {...register('description')}
                            placeholder="Brief description of this category"
                            rows={3}
                            className="w-full px-5 py-3 rounded-2xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-bold text-sm"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" className="flex-1 rounded-2xl h-12" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button type="submit" className="flex-1 rounded-2xl h-12 shadow-premium hover:shadow-glow" isLoading={isActionLoading}>
                            {editTarget ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Category?"
                message="This will decouple all programs currently associated with this category. This action is permanent."
                isLoading={isActionLoading}
            />
        </div>
    );
}
