'use client';

import React, { useState, useEffect } from 'react';
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
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else {
        setItemsPerView(2);
      }

    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

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
    <section className="py-20 bg-background border-y border-border">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10 flex justify-between items-center">

        <div>
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">
            {t('featuredLearning')}
          </h2>

          <h3 className="text-3xl font-black font-outfit">
            {t('topPrograms')}
          </h3>
        </div>

        <div className="flex gap-3">

          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-12 h-12 border border-border rounded-2xl flex items-center justify-center disabled:opacity-30"
          >
            <ArrowLeft className="w-5 h-5"/>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide >= programs.length - itemsPerView}
            className="w-12 h-12 border border-border rounded-2xl flex items-center justify-center disabled:opacity-30"
          >
            <ArrowRight className="w-5 h-5"/>
          </button>

        </div>

      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">

        <motion.div
          animate={{ x: `-${currentSlide * (100 / itemsPerView)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex gap-6"
        >

          {programs.map((program) => (

            <motion.div
              key={program.id}
              whileHover={{ y: -8 }}
              className="min-w-full sm:min-w-[calc(50%-12px)] bg-surface/50 border border-border rounded-[2rem] overflow-hidden shadow-premium flex flex-col"
            >

              {/* Image */}
              <div className="relative h-56 sm:h-64">

                <Image
                  src={program.thumbnail}
                  alt={program.name}
                  fill
                  className="object-cover"
                />

                <button
                  onClick={() => setSelectedVideo(program.videoId)}
                  className="absolute inset-0 flex items-center justify-center"
                >

                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">

                    <Play className="w-7 h-7 text-white"/>

                  </div>

                </button>

                <div className="absolute top-4 left-4">

                  <div className={`px-4 py-1 bg-gradient-to-r ${program.color} text-white text-xs rounded-full`}>
                    {program.tag}
                  </div>

                </div>

              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-1">

                <div>

                  <p className="text-primary text-xs font-bold mb-2">
                    {t('proProgram') || "PROFESSIONAL PROGRAM"}
                  </p>

                  <h4 className="text-xl font-bold mb-2">
                    {program.name}
                  </h4>

                  <p className="text-muted-foreground text-sm mb-6">
                    {program.description}
                  </p>

                </div>

                <button
                  onClick={() => setSelectedVideo(program.videoId)}
                  className="w-full py-3 rounded-xl border border-border hover:bg-primary hover:text-white transition"
                >

                  {t('watchNow') || "Watch Now"} <Play className="w-4 h-4 inline"/>

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
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            onClick={() => setSelectedVideo(null)}
          >

            <motion.div
              className="relative w-full max-w-5xl aspect-video"
              initial={{ scale:0.9 }}
              animate={{ scale:1 }}
              exit={{ scale:0.9 }}
              onClick={(e)=>e.stopPropagation()}
            >

              <button
                onClick={()=>setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-black/60 p-2 rounded-lg"
              >
                <X className="w-6 h-6 text-white"/>
              </button>

              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full rounded-xl"
                allowFullScreen
              />

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
};