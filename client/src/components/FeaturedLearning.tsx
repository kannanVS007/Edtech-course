'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import Image from 'next/image';
import { useLanguageStore } from '@/store/languageStore';

interface Program {
    id: string;
    name: string;
    description: string;
    videoId: string;
    thumbnail: string;
    tag: string;
    color: string;
}

const programs: Program[] = [
    {
        id: '1',
        name: "Balachandra (Tamil)",
        description: "Comprehensive Web Development and System Design in Tamil.",
        videoId: "UuhX-GzkTU8",
        thumbnail: "/featured/balachandra.jpg",
        tag: "Tech Guru",
        color: "from-blue-600 to-indigo-600"
    },
    {
        id: '2',
        name: "Code IO (Tamil)",
        description: "In-depth Data Structures and Algorithms with easy-to-understand logic.",
        videoId: "fmSnLiAv-zc",
        thumbnail: "/featured/codeio.jpg",
        tag: "Best for logic",
        color: "from-purple-600 to-pink-600"
    },
    {
        id: '3',
        name: "Error Makes Clever",
        description: "Practical coding and problem solving for real-world scenarios.",
        videoId: "m67-bOpOoPU",
        thumbnail: "/featured/emc.jpg",
        tag: "Tamil Mastery",
        color: "from-amber-600 to-orange-600"
    },
    {
        id: '4',
        name: "JVL Code (Tamil)",
        description: "Full-stack frameworks and modern development practices explained.",
        videoId: "8FhN2-aahVE",
        thumbnail: "/featured/jvl.jpg",
        tag: "Expert Training",
        color: "from-emerald-600 to-teal-600"
    }
];

export const FeaturedLearning = () => {
    const { t } = useLanguageStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [itemsPerView, setItemsPerView] = React.useState(3);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1200) setItemsPerView(3);
            else if (window.innerWidth >= 768) setItemsPerView(2);
            else setItemsPerView(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        if (currentSlide < programs.length - itemsPerView) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <section id="featured" className="py-20 overflow-hidden bg-background relative border-y border-border">
            <div className="max-w-7xl mx-auto px-4 mb-10 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">{t('featuredLearning')}</h2>
                    <h3 className="text-3xl font-black font-outfit tracking-premium">{t('topPrograms')}</h3>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm bg-background z-10"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide >= programs.length - itemsPerView}
                        className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm bg-background z-10"
                    >
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 overflow-visible relative">
                <motion.div
                    animate={{ x: `calc(-${currentSlide * (100 / itemsPerView)}% - ${currentSlide * (24 / itemsPerView)}px)` }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="flex flex-nowrap gap-6"
                >
                    {programs.map((program) => (
                        <motion.div
                            key={program.id}
                            className="min-w-[calc(100%-8px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] rounded-[2.5rem] bg-surface/50 border border-border group overflow-hidden shadow-premium shrink-0 relative flex flex-col"
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative h-56 sm:h-64 overflow-hidden">
                                <Image
                                    src={program.thumbnail}
                                    alt={program.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                                <button
                                    onClick={() => setSelectedVideo(program.videoId)}
                                    className="absolute inset-0 flex items-center justify-center group/btn z-10"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/btn:scale-110 group-hover/btn:bg-primary transition-all duration-300">
                                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current translate-x-0.5" />
                                    </div>
                                </button>
                                <div className="absolute top-4 left-4 z-20">
                                    <div className={`px-4 py-1.5 bg-gradient-to-r ${program.color} rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-lg`}>
                                        {program.tag}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{t('proProgram') || 'PROFESSIONAL PROGRAM'}</p>
                                    <h4 className="text-xl sm:text-2xl font-black font-outfit tracking-premium mb-3 line-clamp-1">{program.name}</h4>
                                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-6">
                                        {program.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(program.videoId)}
                                    className="w-full py-4 rounded-2xl bg-surface border border-border group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {t('watchNow') || 'Watch Now'} <Play className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-black/40 text-white hover:bg-red-500 transition-all active:scale-95"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
};
