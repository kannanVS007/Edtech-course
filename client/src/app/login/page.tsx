'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, Github, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import api from '@/lib/axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import Image from 'next/image';
import { useEffect } from 'react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser, setToken } = useAuthStore();
    const { t, language, setLanguage } = useLanguageStore();
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            handleGitHubSuccess(code);
        }
    }, []);

    const handleGitHubSuccess = async (code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/github-login', { code });
            const { token, data: { user } } = response.data;

            setToken(token);
            setUser(user);

            // Clear the code from URL
            window.history.replaceState({}, document.title, window.location.pathname);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'GitHub Sign-In failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/login`;
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        window.location.href = githubUrl;
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/google-login', {
                idToken: credentialResponse.credential,
            });
            const { token, data: { user } } = response.data;

            setToken(token);
            setUser(user);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google Sign-In failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', data);
            const { token, data: { user } } = response.data;

            setToken(token);
            setUser(user);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg z-10"
            >
                <div className="text-center mb-10">
                    <div className="relative w-20 h-20 mx-auto mb-6 group cursor-pointer">
                        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:bg-primary/30 transition-colors" />
                        <div className="relative w-full h-full bg-background border border-border rounded-3xl flex items-center justify-center shadow-premium-xl overflow-hidden p-3">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center leading-none mb-4">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Become A</span>
                        <h1 className="text-4xl font-black text-primary tracking-premium font-outfit uppercase">Skiller</h1>
                    </div>
                    <p className="text-muted-foreground font-medium text-base md:text-lg tracking-tight">
                        {t('loginSubtitle') || 'Login to continue your mastery journey.'}
                    </p>
                </div>

                <div className="bg-background/60 backdrop-blur-xl border border-border shadow-premium-xl rounded-[3rem] p-6 sm:p-10 md:p-14 glass">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-2"
                            >
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="vskannan@example.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register('password')}
                            error={errors.password?.message}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 hover:bg-surface rounded-xl text-muted-foreground hover:text-primary transition-all"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        <div className="text-right">
                            <Link href="#" className="text-sm font-semibold text-primary hover:underline underline-offset-4 font-inter">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                            isLoading={isLoading}
                        >
                            {t('login')} <ArrowRight className="w-5 h-5" />
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-background text-muted-foreground uppercase font-semibold">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleGitHubLogin}
                                className="flex-1 py-3 px-4 border border-border rounded-2xl flex items-center justify-center gap-2 hover:bg-surface transition-all active:scale-[0.98]"
                            >
                                <Github className="w-5 h-5" />
                                <span className="font-semibold text-foreground/80">GitHub</span>
                            </button>
                            <div className="flex-1 overflow-hidden">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Sign-In failed. Please try again.')}
                                    use_fedcm_for_prompt={true}
                                    theme="filled_blue"
                                    shape="pill"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-muted-foreground font-medium">
                    Don't have an account? {' '}
                    <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4 tracking-tight">
                        Sign up for free
                    </Link>
                </p>

                {/* Language Switcher */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'en' ? 'bg-primary text-white font-bold' : 'text-muted-foreground font-medium hover:text-primary'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('ta')}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'ta' ? 'bg-primary text-white font-bold' : 'text-muted-foreground font-medium hover:text-primary'}`}
                    >
                        தமிழ்
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
