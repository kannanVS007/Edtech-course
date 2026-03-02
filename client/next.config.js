const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60
                }
            }
        },
        {
            urlPattern: /\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60
                }
            }
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: "CacheFirst",
            options: {
                cacheName: "static-images",
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 30 * 24 * 60 * 60
                }
            }
        }
    ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "img.youtube.com" },
            { protocol: "https", hostname: "*.cloudinary.com" },
            { protocol: "https", hostname: "images.unsplash.com" }
        ]
    },
    compress: true,
    poweredByHeader: false
};

module.exports = withPWA(nextConfig);