'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { BookOpen, User, Mail, Lock, ArrowRight, Github, Eye, EyeOff } from 'lucide-react';
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

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

            localStorage.setItem('token', token);
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
        const redirectUri = `${window.location.origin}/register`;
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

            localStorage.setItem('token', token);
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
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/signup', {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            const { token, data: { user } } = response.data;

            localStorage.setItem('token', token);
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
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-outfit">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg z-10"
            >
                <div className="text-center mb-10">
                    <div className="relative w-24 h-24 mx-auto mb-6 group cursor-pointer">
                        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl group-hover:bg-primary/30 transition-colors" />
                        <div className="relative w-full h-full bg-background border border-border rounded-[2rem] flex items-center justify-center shadow-premium-xl overflow-hidden p-4">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center leading-none mb-4">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] mb-1">Become A</span>
                        <h1 className="text-5xl font-black text-primary tracking-premium uppercase">Skiller</h1>
                    </div>
                    <p className="text-muted-foreground font-medium text-lg tracking-tight">
                        The elite destination for technical excellence.
                    </p>
                </div>

                <div className="bg-background/60 backdrop-blur-xl border border-border shadow-premium-xl rounded-[3rem] p-10 md:p-14 glass">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl flex items-center gap-2 uppercase tracking-wider"
                            >
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <Input
                            label="Full Name"
                            placeholder="V.S. Kannan"
                            {...register('name')}
                            error={errors.name?.message}
                        />

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

                        <Input
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="p-2 hover:bg-surface rounded-xl text-muted-foreground hover:text-primary transition-all"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-6 rounded-2xl shadow-premium hover:shadow-glow transition-all"
                            isLoading={isLoading}
                        >
                            Create Account <ArrowRight className="w-6 h-6" />
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-background text-muted-foreground uppercase font-black tracking-widest">Or join with</span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGitHubLogin}
                                className="flex-1 py-3 px-6 border border-border rounded-2xl flex items-center justify-center gap-3 hover:bg-surface transition-all group active:scale-95 shadow-sm"
                            >
                                <Github className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                                <span className="font-bold text-sm text-foreground/80">GitHub</span>
                            </button>
                            <div className="flex-1">
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

                <p className="text-center mt-10 text-muted-foreground font-bold">
                    Already a Skiller? {' '}
                    <Link href="/login" className="text-primary hover:underline underline-offset-8 transition-all">
                        Log in here
                    </Link>
                </p>

                <div className="flex justify-center gap-6 mt-10">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`text-xs font-black uppercase tracking-widest transition-all ${language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('ta')}
                        className={`text-xs font-black uppercase tracking-widest transition-all ${language === 'ta' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        தமிழ்
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
