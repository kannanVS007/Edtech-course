import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
});

const _env = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
}

export const env = _env.data || { NEXT_PUBLIC_API_URL: 'http://localhost:5000/api/v1' };
