'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Shield, Zap, Globe, ArrowRight, ArrowLeft, Play, CheckCircle, Star, GraduationCap, Users, Award, MoveRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/languageStore';
import { Instagram, Linkedin, Phone } from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const { t, language, setLanguage } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGetStarted = () => {
    router.push('/register');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const courses = [
    { name: "Balachandra (Tamil)", color: "from-blue-600 to-indigo-600", tag: "Tech Guru" },
    { name: "Code IO (Tamil)", color: "from-purple-600 to-pink-600", tag: "Best for logic" },
    { name: "JVL Code (Tamil)", color: "from-emerald-600 to-teal-600", tag: "Expert Training" },
    { name: "Error Makes Clever", color: "from-amber-600 to-orange-600", tag: "Tamil Mastery" },
    { name: "Tamil Skills Hub", color: "from-slate-700 to-blue-800", tag: "Career Ready" },
    { name: "Creative Tamil", color: "from-rose-600 to-red-600", tag: "UI/UX King" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border shadow-premium glass transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <Image
                src="/logo.png"
                alt="Become A Skiller Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] -mb-1">Become A</span>
              <span className="text-2xl font-black text-primary tracking-premium font-outfit">Skiller</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-premium">
            <Link href="#features" className="text-muted-foreground/70 hover:text-primary transition-all hover:translate-y-[-1px]">{t('features') || 'Features'}</Link>
            <Link href="#courses" className="text-muted-foreground/70 hover:text-primary transition-all hover:translate-y-[-1px]">{t('courses') || 'Programs'}</Link>

            {/* Language Toggle */}
            <div className="flex bg-surface/50 border border-border p-1 rounded-xl">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest transition-all ${language === 'en' ? 'bg-primary text-white shadow-glow' : 'hover:text-primary'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest transition-all ${language === 'ta' ? 'bg-primary text-white shadow-glow' : 'hover:text-primary'}`}
              >
                தமிழ்
              </button>
            </div>

            <Link href="/login" className="px-6 py-2.5 rounded-2xl border border-border text-foreground hover:bg-surface hover:border-primary/30 transition-all shadow-sm">{t('login')}</Link>
            <button
              onClick={handleGetStarted}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white hover:shadow-glow hover:translate-y-[-2px] active:translate-y-[0px] transition-all shadow-premium-xl"
            >
              {t('getStarted') || 'Get Started'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 font-bold text-lg">
                <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-primary">Features</Link>
                <Link href="#courses" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-primary">Programs</Link>

                {/* Language Toggle for Mobile */}
                <div className="flex bg-surface/50 border border-border p-1.5 rounded-2xl w-fit">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${language === 'en' ? 'bg-primary text-white shadow-glow' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('ta')}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${language === 'ta' ? 'bg-primary text-white shadow-glow' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    தமிழ்
                  </button>
                </div>

                <div className="h-px bg-border my-2" />
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-4 rounded-2xl border border-border">{t('login')}</Link>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-4 rounded-2xl bg-primary text-white shadow-premium-xl"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] animate-pulse-slow" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl inline-flex items-center gap-2.5 text-primary text-sm font-black tracking-[0.1em] uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{t('heroTag')}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-premium leading-[0.9] font-outfit">
              100% Free <br />
              <span className="gradient-text">Coding Learning Platform</span>
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 rounded-lg text-xs">Tamil</span>
              <span className="px-3 py-1 font-bold uppercase tracking-widest bg-blue-500/10 text-blue-500 rounded-lg text-xs">English</span>
            </div>

            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed font-medium">
              {t('heroSubtitle')}
            </p>

            <div className="bg-surface/50 border border-border rounded-3xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">{t('premiumFeatures')}</h4>
                <div className="flex flex-wrap gap-2 text-sm font-semibold">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> {t('mockTests')}</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-lg flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {t('interviewPrep')}</span>
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t('doubtSessions')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => router.push('/courses')}
                className="px-10 py-5 rounded-2.5xl bg-gradient-to-r from-primary to-blue-600 text-white text-lg font-black hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-premium-xl"
              >
                {t('browseCourses')} <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={handleGetStarted}
                className="px-10 py-5 rounded-2.5xl border-2 border-primary/20 bg-primary/5 font-black text-lg hover:bg-primary/10 hover:border-primary/40 flex items-center justify-center gap-3 transition-all"
              >
                {t('startLearningNow')} <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trusted By / Social Proof */}
            <div className="mt-16 flex items-center gap-6 opacity-60 grayscale filter hover:grayscale-0 transition-all duration-700">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2">{t('topMentors')}</span>
              <div className="flex gap-8 items-center">
                <div className="font-outfit font-black text-xl italic tracking-tighter">Google</div>
                <div className="font-outfit font-black text-xl italic tracking-tighter">Meta</div>
                <div className="font-outfit font-black text-xl italic tracking-tighter">TCS</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Floating UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative lg:-mt-14"
          >
            {/* Main Mockup Card */}
            <div className="relative z-10 p-4 bg-background border border-border rounded-5xl shadow-premium-xl glass group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-50" />
              <div className="relative bg-surface rounded-4xl border border-border h-[460px] w-full overflow-hidden shadow-inner">
                <Image
                  src="/dashboard-mockup.png"
                  alt="Become A Skiller Dashboard"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                {/* Overlay Highlights */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 -right-12 z-20 p-6 bg-background border border-border rounded-3xl shadow-premium-xl glass flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t('successStory')}</p>
                <p className="text-lg font-black leading-none">{t('lessonComplete')}</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-12 z-20 p-6 bg-background border border-border rounded-3xl shadow-premium-xl glass flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t('newReward')}</p>
                <p className="text-lg font-black leading-none">{t('skillerBadge')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: t('activeStudents'), value: "12K+", icon: Users },
              { label: t('totalCourses'), value: "450+", icon: GraduationCap },
              { label: t('successRate'), value: "98%", icon: Award },
              { label: t('hoursContent'), value: "2.5K+", icon: Play }
            ].map((stat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/5 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-premium">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black mb-2 font-outfit tracking-tighter">{stat.value}</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Course Slider */}
      {isMounted && (
        <section className="py-20 overflow-hidden bg-background relative border-y border-border">
          <div className="max-w-7xl mx-auto px-4 mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">{t('featuredLearning')}</h2>
              <h3 className="text-3xl font-black font-outfit tracking-premium">{t('topPrograms')}</h3>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm bg-background z-10"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => Math.min(courses.length - itemsPerView, prev + 1))}
                disabled={currentSlide >= courses.length - itemsPerView}
                className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-surface hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm bg-background z-10"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 overflow-hidden">
            <motion.div
              animate={{ x: `calc(-${currentSlide * (100 / itemsPerView)}% - ${currentSlide * (24 / itemsPerView)}px)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-nowrap gap-6"
            >
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="min-w-[100%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] h-[240px] rounded-[2.5rem] bg-gradient-to-br p-px relative group overflow-hidden shadow-premium shrink-0"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-90`} />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                  <div className="relative h-full w-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                        {course.tag}
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-primary transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">{t('proProgram')}</p>
                      <h4 className="text-2xl font-black text-white font-outfit tracking-premium">{course.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section id="features" className="py-32 relative px-4 bg-surface/30 border-y border-border overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">{t('coreEcosystem')}</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-6 font-outfit tracking-premium">{t('featuresTitle')}</h3>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              {t('featuresDesc')}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                icon: Globe,
                title: t('bilingualTitle'),
                desc: t('bilingualDesc'),
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: t('industryTitle'),
                desc: t('industryDesc'),
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Zap,
                title: t('neuralTitle'),
                desc: t('neuralDesc'),
                gradient: "from-amber-500 to-orange-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group p-10 bg-background border border-border rounded-[2.5rem] shadow-premium hover:shadow-premium-xl transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity blur-3xl`} />
                <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
                  <feature.icon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 font-outfit tracking-premium">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed mb-8">{feature.desc}</p>
                <Link href="/register" className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                  {t('learnMore')} <MoveRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Course Categories */}
      <section id="courses" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">{t('infinitePaths')}</h2>
              <h3 className="text-4xl md:text-6xl font-black font-outfit tracking-premium">
                {t('readyToSpecialize')}
              </h3>
            </div>
            <Link href="/courses" className="px-8 py-4 rounded-2xl bg-surface border border-border font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-premium group">
              {t('exploreAll')} <div className="p-1 bg-primary/10 group-hover:bg-white/20 rounded-lg"><ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: t('webEng'), courses: '24', icon: '01', gradient: 'from-[#2563eb] to-[#0ea5e9]' },
              { name: t('uiDesign'), courses: '18', icon: '02', gradient: 'from-[#6366f1] to-[#a855f7]' },
              { name: t('dataInt'), courses: '15', icon: '03', gradient: 'from-[#10b981] to-[#3b82f6]' },
              { name: t('mobSys'), courses: '12', icon: '04', gradient: 'from-[#f59e0b] to-[#ef4444]' }
            ].map((cat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="group relative h-72 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-xl transition-all duration-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-90 group-hover:opacity-100 transition-all z-10`} />
                <div className="absolute top-8 right-8 z-20 text-white/20 text-5xl font-black italic tracking-tighter group-hover:text-white/30 transition-colors uppercase">
                  {cat.icon}
                </div>
                <div className="absolute bottom-10 left-10 z-20 text-white">
                  <h4 className="text-2xl font-black mb-2 font-outfit tracking-premium">{cat.name}</h4>
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {cat.courses} Modules
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonial */}
      <section className="py-32 relative bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px]" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-12 inline-flex gap-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />)}
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-16 text-white font-outfit tracking-premium leading-tight">
              {t('testimonial')}
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-1 shadow-glow">
                <div className="w-full h-full bg-[#0f172a] rounded-2.5xl flex items-center justify-center font-black text-3xl text-white">VK</div>
              </div>
              <div>
                <p className="font-black text-2xl text-white mb-1">V.S. Kannan</p>
                <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">{t('prinArch')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* High-Impact CTA */}
      <section className="py-32 px-4 relative bg-background">
        <div className="max-w-6xl mx-auto relative group">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-background border border-border rounded-[3rem] p-16 md:p-24 text-center overflow-hidden shadow-premium-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-10 font-outfit tracking-premium">{t('goPro')}</h2>
              <p className="text-muted-foreground text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                {t('ctaDesc')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/register" className="px-16 py-6 rounded-2.5xl bg-primary text-white font-black text-xl hover:shadow-glow hover:scale-[1.02] transition-all shadow-premium-xl flex items-center justify-center gap-3 active:scale-95">
                  {t('startLearningNow')} <ArrowRight className="w-6 h-6" />
                </Link>
                <Link href="/courses" className="px-16 py-6 rounded-2.5xl border-2 border-border font-black text-xl hover:bg-surface transition-all flex items-center justify-center active:scale-95">
                  View Programs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 border-t border-border bg-surface/30 px-4"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Become A</span>
                <span className="text-2xl font-black text-primary tracking-premium font-outfit">Skiller</span>
              </div>
            </div>
            <p className="text-muted-foreground font-medium max-w-sm mb-8 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/mr__savvge_/" target="_blank" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-all cursor-pointer shadow-sm active:scale-95 group">
                <Instagram className="w-6 h-6 transition-transform group-hover:scale-110" />
              </Link>
              <Link href="https://www.linkedin.com/in/kannan-vs/" target="_blank" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm active:scale-95 group">
                <Linkedin className="w-6 h-6 transition-transform group-hover:scale-110" />
              </Link>
              <Link href="https://wa.me/916379524135" target="_blank" className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-all cursor-pointer shadow-sm active:scale-95 group">
                <Phone className="w-6 h-6 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">{t('ecosystem')}</h4>
            <ul className="space-y-4 text-muted-foreground font-bold text-sm">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="/mentors" className="hover:text-primary transition-colors">Mentorship</Link></li>
              <li><Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link></li>
              <li><Link href="/scholarships" className="hover:text-primary transition-colors">Scholarships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">{t('support')}</h4>
            <ul className="space-y-4 text-muted-foreground font-bold text-sm">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50">
          <p className="text-muted-foreground text-sm font-bold">{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('systemsActive')}</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
