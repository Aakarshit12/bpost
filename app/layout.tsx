import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: 'Comprehensive Blog Website',
        template: '%s | Blog'
    },
    description: 'A production-ready blog website built with Next.js 14+, MongoDB, and rich text editing capabilities.',
    keywords: ['blog', 'nextjs', 'mongodb', 'typescript', 'react'],
    authors: [{ name: 'Blog Admin' }],
    creator: 'Blog Admin',
    publisher: 'Blog Admin',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://your-production-domain.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        title: 'Comprehensive Blog Website',
        description: 'A production-ready blog website built with Next.js 14+, MongoDB, and rich text editing capabilities.',
        siteName: 'Blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Comprehensive Blog Website',
        description: 'A production-ready blog website built with Next.js 14+, MongoDB, and rich text editing capabilities.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navigation />
                <main>
                    {children}
                </main>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
} 