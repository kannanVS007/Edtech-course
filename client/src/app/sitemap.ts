import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://edtech.becomeskiller.com';
    const now = new Date();

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        // Add more dynamic course URLs from DB as needed
        {
            url: `${baseUrl}/courses/web-development`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/courses/data-science`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];
}
