import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Post from '@/lib/models/Post';
import { updatePostSchema } from '@/lib/utils/validation';
import { sanitizeHTML } from '@/lib/utils/security';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const { slug } = params;

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json(
                { error: 'Invalid slug provided' },
                { status: 400 }
            );
        }

        // Find post and increment view count atomically
        const post = await Post.findOneAndUpdate(
            {
                slug,
                isDeleted: false,
                status: 'published' // Only show published posts to public
            },
            { $inc: { viewCount: 1 } },
            {
                new: true,
                runValidators: false
            }
        );

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ post });

    } catch (error: any) {
        console.error('GET /api/posts/[slug] error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const { slug } = params;
        const body = await request.json();

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json(
                { error: 'Invalid slug provided' },
                { status: 400 }
            );
        }

        // Validate input
        const validatedData = updatePostSchema.parse(body);

        // Find existing post
        const existingPost = await Post.findOne({
            slug,
            isDeleted: false
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Sanitize content if provided
        if (validatedData.content) {
            validatedData.content = sanitizeHTML(validatedData.content);
        }

        // Update post
        const updatedPost = await Post.findOneAndUpdate(
            { slug, isDeleted: false },
            { ...validatedData },
            {
                new: true,
                runValidators: true
            }
        );

        return NextResponse.json({
            message: 'Post updated successfully',
            post: updatedPost
        });

    } catch (error: any) {
        console.error('PUT /api/posts/[slug] error:', error);

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const { slug } = params;

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json(
                { error: 'Invalid slug provided' },
                { status: 400 }
            );
        }

        // Soft delete the post
        const deletedPost = await Post.findOneAndUpdate(
            { slug, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!deletedPost) {
            return NextResponse.json(
                { error: 'Post not found or already deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Post deleted successfully'
        });

    } catch (error: any) {
        console.error('DELETE /api/posts/[slug] error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 