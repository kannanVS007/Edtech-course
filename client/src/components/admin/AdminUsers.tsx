'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Pencil, Trash2, ShieldCheck, ShieldOff, Mail, Phone, Calendar, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/axios';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ role: '', status: '' });
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (filters.role) params.append('role', filters.role);
            if (filters.status) params.append('status', filters.status);

            const response = await api.get(`/users?${params.toString()}`);
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, filters]);

    useEffect(() => {
        const timeout = setTimeout(fetchUsers, 500);
        return () => clearTimeout(timeout);
    }, [fetchUsers]);

    const handleRoleUpdate = async (id: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setIsActionLoading(true);
        try {
            await api.patch(`/users/${id}/role`, { role: newRole });
            await fetchUsers();
        } catch (error) {
            console.error('Failed to update role', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        setIsActionLoading(true);
        try {
            await api.patch(`/users/${id}/status`, { status: newStatus });
            await fetchUsers();
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsActionLoading(true);
        try {
            await api.delete(`/users/${deleteTarget}`);
            await fetchUsers();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete user', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 font-outfit">
                        <Users className="w-8 h-8 text-primary" /> User Management
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 font-medium italic">
                        Elite control for the Skiller ecosystem.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                    />
                </div>
                <select
                    value={filters.role}
                    onChange={e => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="p-3 bg-background border border-border rounded-2xl outline-none font-medium text-sm"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin Only</option>
                    <option value="user">User Only</option>
                </select>
                <select
                    value={filters.status}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="p-3 bg-background border border-border rounded-2xl outline-none font-medium text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            <div className="bg-background border border-border rounded-[2rem] overflow-hidden shadow-premium glass">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                {['User', 'Contact', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary font-black text-sm shrink-0 shadow-sm">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-sm tracking-tight">{user.name}</p>
                                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">ID: {user._id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                            {user.mobile && (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                                    <Phone className="w-3 h-3" /> {user.mobile}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === 'admin' ? 'primary' : 'neutral'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.status === 'active' ? 'success' : 'danger'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                            <Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => handleRoleUpdate(user._id, user.role)}
                                                className={`p-2.5 rounded-xl transition-all ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'} hover:scale-110`}
                                                title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                            >
                                                {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            </button>
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => handleStatusUpdate(user._id, user.status)}
                                                className={`p-2.5 rounded-xl transition-all ${user.status === 'active' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'} hover:scale-110`}
                                                title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                            >
                                                {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => setDeleteTarget(user._id)}
                                                className="p-2.5 bg-red-500/10 text-red-600 rounded-xl hover:scale-110 transition-all font-bold"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isLoading && (
                        <div className="p-8 text-center animate-pulse text-primary font-black uppercase tracking-widest text-xs">
                            Syncing Skiller Data...
                        </div>
                    )}
                    {!isLoading && users.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="font-black uppercase tracking-widest text-xs">No skillers found in the database.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Permanently Expel User?"
                message="This will immediately remove the skiller from all enrolled programs and purge their data from our ecosystem."
                isLoading={isActionLoading}
            />
        </div>
    );
}
