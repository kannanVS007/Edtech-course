import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ProtectedRoute from '@/providers/ProtectedRoute';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siteUrl = 'https://becomeskiller.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Become A Skiller — Master Tamil & English Properly',
    template: '%s | Become A Skiller',
  },
  description:
    'The premium multi-language EdTech platform for structured technical learning in Tamil and English. Handcrafted courses for the next generation of engineers.',
  keywords: [
    'Become A Skiller',
    'Tamil online learning',
    'EdTech Tamil',
    'Next.js course Tamil',
    'data science Tamil',
    'online courses India',
    'bilingual learning platform',
    'premium edtech platform',
  ],
  authors: [{ name: 'VS Kannan', url: siteUrl }],
  creator: 'VS Kannan',
  publisher: 'Become A Skiller EdTech',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Become A Skiller',
    title: 'Become A Skiller — Learn Tamil & English Properly',
    description:
      'Premium structured technical learning in Tamil and English. Join 12,000+ skillers today.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Become A Skiller Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become A Skiller',
    description: 'Premium bilingual learning platform — Master Tamil & English Properly.',
    images: ['/og-image.png'],
    creator: '@vskannan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Become A Skiller',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Premium multi-language structured learning in Tamil & English.',
  sameAs: ['https://github.com/vskannan'],
};

import ScrollProgress from '@/components/ui/ScrollProgress';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en-IN" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ScrollProgress />
            <PWAInstallPrompt />
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
