import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Become A Skiller - Master Tamil & English Properly',
        short_name: 'Skiller',
        description: 'The premium multi-language SaaS learning platform with structured Tamil & English technical courses.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563EB',
        orientation: 'portrait',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64 32x32 24x24 16x16',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
        shortcuts: [
            {
                name: 'My Courses',
                url: '/dashboard',
                description: 'Continue your learning journey',
            },
            {
                name: 'Explore Courses',
                url: '/courses',
                description: 'Browse our technical programs',
            }
        ],
        categories: ['education', 'productivity', 'utilities'],
        lang: 'en-IN',
        dir: 'ltr',
    };
}
