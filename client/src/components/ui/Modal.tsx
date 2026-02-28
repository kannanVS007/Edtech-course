'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full ${sizes[size]} bg-background border border-border rounded-[2rem] shadow-2xl overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-surface rounded-xl text-muted-foreground hover:text-foreground transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    isLoading?: boolean;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', isLoading }: ConfirmModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <p className="text-muted-foreground mb-6 font-medium leading-relaxed">{message}</p>
        <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
        </div>
    </Modal>
);
