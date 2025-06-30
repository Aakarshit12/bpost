import { NextResponse } from 'next/server';

export async function GET() {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow public content
Allow: /posts/
Allow: /rss.xml

# Crawl delay (optional)
Crawl-delay: 1`;

    return new NextResponse(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
    });
} 