const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
        },
        {
            urlPattern: /^https:\/\/www\.youtube\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'youtube-embeds', networkTimeoutSeconds: 10 },
        },
        {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'static-images',
                expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
        },
        {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-assets' },
        },
    ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'img.youtube.com' },
            { protocol: 'https', hostname: '*.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
        ],
        formats: ['image/avif', 'image/webp'],
    },
    compress: true,
    poweredByHeader: false,
    experimental: {
        optimizeCss: false,
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        },
        {
            source: '/sw.js',
            headers: [
                { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
                { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
            ],
        },
    ],
};

module.exports = withPWA(nextConfig);
