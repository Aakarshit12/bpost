/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        domains: ['images.unsplash.com', 'via.placeholder.com'],
        formats: ['image/webp', 'image/avif'],
    },
    async rewrites() {
        return [{
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
            {
                source: '/robots.txt',
                destination: '/api/robots',
            },
            {
                source: '/rss.xml',
                destination: '/api/rss',
            },
        ];
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: [{
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'origin-when-cross-origin',
                },
            ],
        }, ];
    },
};

module.exports = nextConfig;