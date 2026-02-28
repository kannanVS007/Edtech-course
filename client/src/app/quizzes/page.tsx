'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, ArrowRight, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const MOCK_QUIZ = {
    title: 'Next.js & TypeScript Fundamentals',
    course: 'Next.js & TypeScript Mastery',
    timer: 600, // 10 minutes in seconds
    questions: [
        {
            id: 1,
            question: 'What is the primary purpose of the Next.js App Router?',
            options: [
                'To handle server-side rendering only',
                'To provide a file-system based routing solution with React Server Components',
                'To manage state in React applications',
                'To replace CSS in Next.js apps',
            ],
            correct: 1,
            explanation: 'The App Router in Next.js 14 provides file-system-based routing with native support for React Server Components, layouts, and streaming.',
        },
        {
            id: 2,
            question: 'Which TypeScript utility type makes all properties of a type optional?',
            options: ['Required<T>', 'Readonly<T>', 'Partial<T>', 'Pick<T, K>'],
            correct: 2,
            explanation: 'Partial<T> constructs a type with all properties of T set to optional, which is useful for update operations.',
        },
        {
            id: 3,
            question: 'What does ISR stand for in Next.js?',
            options: [
                'Incremental Static Regeneration',
                'In-Server Rendering',
                'Integrated State Resolution',
                'Initial Server Request',
            ],
            correct: 0,
            explanation: 'ISR (Incremental Static Regeneration) allows you to update static pages after build time, combining benefits of static generation and SSR.',
        },
        {
            id: 4,
            question: 'In TypeScript, what is a "union type"?',
            options: [
                'A type that merges two interfaces',
                'A type that can be one of several types',
                'A type for database unions',
                'A type that requires all specified types',
            ],
            correct: 1,
            explanation: 'A union type (A | B) allows a value to be of type A OR type B, giving type-safe flexibility.',
        },
        {
            id: 5,
            question: 'Which hook is used for server-side data fetching in Next.js App Router?',
            options: ['useEffect', 'useSWR', 'async Server Component / fetch()', 'useQuery'],
            correct: 2,
            explanation: 'In the App Router, you use async Server Components with native fetch() which supports caching and revalidation out of the box.',
        },
    ],
};

type QuizState = 'idle' | 'started' | 'submitted' | 'results';

export default function QuizPage() {
    const [state, setState] = useState<QuizState>('idle');
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(MOCK_QUIZ.timer);
    const [selected, setSelected] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const q = MOCK_QUIZ.questions[current];
    const totalQ = MOCK_QUIZ.questions.length;
    const score = Object.entries(answers).filter(([qi, ai]) => MOCK_QUIZ.questions[Number(qi)].correct === ai).length;

    useEffect(() => {
        if (state !== 'started') return;
        if (timeLeft <= 0) { setState('results'); return; }
        const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearTimeout(t);
    }, [state, timeLeft]);

    const handleStart = () => {
        setState('started');
        setTimeLeft(MOCK_QUIZ.timer);
        setAnswers({});
        setCurrent(0);
        setSelected(null);
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setAnswers((p) => ({ ...p, [current]: idx }));
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (current < totalQ - 1) {
            setCurrent((p) => p + 1);
            setSelected(null);
            setShowExplanation(false);
        } else {
            setState('results');
        }
    };

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const percent = Math.round((score / totalQ) * 100);
    const resultVariant = percent >= 80 ? 'success' : percent >= 60 ? 'warning' : 'danger';
    const resultMessage = percent >= 80 ? '🏆 Excellent! You mastered it!' : percent >= 60 ? '✅ Good job! Keep practicing.' : '📚 Keep studying and try again.';

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Quiz Engine</h1>
                    <p className="text-muted-foreground mt-1 font-medium">{MOCK_QUIZ.course}</p>
                </div>

                <AnimatePresence mode="wait">
                    {/* IDLE */}
                    {state === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Card className="text-center p-10">
                                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] mx-auto mb-6 flex items-center justify-center">
                                    <Trophy className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{MOCK_QUIZ.title}</h2>
                                <p className="text-muted-foreground mb-8 font-medium">Test your knowledge with {totalQ} questions. You have {Math.floor(MOCK_QUIZ.timer / 60)} minutes.</p>
                                <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
                                    {[['Questions', totalQ], ['Minutes', 10], ['Pass Score', '60%']].map(([label, val]) => (
                                        <div key={String(label)} className="bg-surface border border-border rounded-2xl p-4">
                                            <p className="text-2xl font-black text-primary">{val}</p>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1">{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button size="lg" onClick={handleStart} className="px-12">
                                    Start Quiz <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {/* STARTED */}
                    {state === 'started' && (
                        <motion.div key="started" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                            {/* Progress Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-muted-foreground">Question {current + 1} of {totalQ}</span>
                                    <div className="flex gap-1.5">
                                        {MOCK_QUIZ.questions.map((_, i) => (
                                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < current ? 'bg-primary' : i === current ? 'bg-primary/50' : 'bg-border'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm ${timeLeft < 60 ? 'border-red-500/30 bg-red-500/10 text-red-500 animate-pulse' : 'border-border bg-surface text-foreground'
                                    }`}>
                                    <Clock className="w-4 h-4" />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            {/* Question Card */}
                            <Card hoverable={false} className="p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <p className="text-xl font-bold leading-snug mb-8">{q.question}</p>
                                        <div className="space-y-3">
                                            {q.options.map((opt, i) => {
                                                const isSelected = selected === i;
                                                const isCorrect = i === q.correct;
                                                const showResult = selected !== null;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleAnswer(i)}
                                                        disabled={selected !== null}
                                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-medium transition-all ${showResult
                                                                ? isCorrect
                                                                    ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                                                                    : isSelected
                                                                        ? 'border-red-500 bg-red-500/10 text-red-600'
                                                                        : 'border-border opacity-50'
                                                                : 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                                                            }`}
                                                    >
                                                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 text-sm ${showResult ? isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-surface' : 'bg-surface border border-border'
                                                            }`}>
                                                            {showResult ? isCorrect ? <CheckCircle className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i) : String.fromCharCode(65 + i)}
                                                        </span>
                                                        <span>{opt}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation */}
                                        <AnimatePresence>
                                            {showExplanation && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3">
                                                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">{q.explanation}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </AnimatePresence>
                            </Card>

                            {selected !== null && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                                    <Button onClick={handleNext} className="px-8">
                                        {current < totalQ - 1 ? `Next Question` : 'See Results'} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* RESULTS */}
                    {state === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                            <Card className="text-center p-10">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                    className={`w-28 h-28 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black ${percent >= 80 ? 'bg-green-500/10 text-green-500' : percent >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                    {percent}%
                                </motion.div>
                                <h2 className="text-2xl font-extrabold mb-2">{resultMessage}</h2>
                                <p className="text-muted-foreground mb-8 font-medium">You got {score} out of {totalQ} questions correct.</p>

                                <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
                                    {[['Correct', score, 'text-green-500'], ['Incorrect', totalQ - score, 'text-red-500'], ['Score', `${percent}%`, 'text-primary']].map(([label, val, color]) => (
                                        <div key={String(label)} className="bg-surface border border-border rounded-2xl p-4">
                                            <p className={`text-2xl font-black ${color}`}>{val}</p>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Answer Review */}
                                <div className="text-left space-y-3 mb-8 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                                    {MOCK_QUIZ.questions.map((qz, i) => {
                                        const userAns = answers[i];
                                        const isCorrectAns = userAns === qz.correct;
                                        return (
                                            <div key={i} className={`p-4 rounded-2xl border flex gap-3 ${isCorrectAns ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                                {isCorrectAns ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                                                <div>
                                                    <p className="text-sm font-semibold">{qz.question}</p>
                                                    {!isCorrectAns && <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ {qz.options[qz.correct]}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button onClick={handleStart} variant="outline" className="gap-2 mr-4">
                                    <RotateCcw className="w-4 h-4" /> Retake Quiz
                                </Button>
                                <Button className="gap-2" onClick={() => window.location.href = '/courses'}>
                                    Browse Courses <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
