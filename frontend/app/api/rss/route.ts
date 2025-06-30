import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Post from '@/lib/models/Post';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Get recent published posts
        const posts = await Post.find({
            status: 'published',
            isDeleted: false
        })
            .select('title slug excerpt content author createdAt')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const baseUrl = process.env.NEXTAUTH_URL || 'https://your-production-domain.com';

        // Generate RSS feed
        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog RSS Feed</title>
    <description>Latest blog posts</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid>${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>${post.author}</author>
    </item>
    `).join('')}
  </channel>
</rss>`;

        return new NextResponse(rss, {
            headers: {
                'Content-Type': 'application/rss+xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600'
            }
        });
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        return new NextResponse('Error generating RSS feed', {
            status: 500
        });
    }
}