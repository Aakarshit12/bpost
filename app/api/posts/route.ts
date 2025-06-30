import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Post from '@/lib/models/Post';
import { postValidationSchema, searchQuerySchema } from '@/lib/utils/validation';
import { rateLimiter } from '@/lib/utils/rateLimiter';
import { sanitizeHTML } from '@/lib/utils/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        if (!rateLimiter(clientIP, 10, 3600000)) { // 10 requests per hour
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        await connectDB();
        const body = await request.json();

        // Validate input
        const validatedData = postValidationSchema.parse(body);

        // Sanitize content
        const sanitizedContent = sanitizeHTML(validatedData.content);

        // Create post
        const post = new Post({
            ...validatedData,
            content: sanitizedContent,
            author: 'Admin', // This should come from authentication
        });

        await post.save();

        return NextResponse.json(
            {
                message: 'Post created successfully',
                post: {
                    id: post._id,
                    title: post.title,
                    slug: post.slug,
                    status: post.status,
                    createdAt: post.createdAt
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('POST /api/posts error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        if (error.name === 'MongoServerError' && error.code === 11000) {
            return NextResponse.json(
                { error: 'A post with this title already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const queryParams = Object.fromEntries(searchParams.entries());

        // Validate query parameters
        const validatedParams = searchQuerySchema.parse(queryParams);

        const {
            page,
            limit,
            status,
            search,
            tags,
            sortBy,
            sortOrder
        } = validatedParams;

        // Build query
        const query: any = { isDeleted: false };

        if (status) {
            query.status = status;
        } else {
            // Only show published posts to public
            query.status = 'published';
        }

        if (search) {
            query.$text = { $search: search };
        }

        if (tags) {
            const tagArray = tags.split(',').map((tag: string) => tag.trim().toLowerCase());
            query.tags = { $in: tagArray };
        }

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const [posts, total] = await Promise.all([
            Post.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-content -isDeleted')
                .lean(),
            Post.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: total,
                hasNextPage,
                hasPrevPage,
                limit
            }
        });

    } catch (error: any) {
        console.error('GET /api/posts error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid query parameters', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 