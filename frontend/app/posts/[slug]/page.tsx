import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Tag, Eye } from 'lucide-react';
import Link from 'next/link';

interface PostPageProps {
    params: { slug: string };
}

async function getPost(slug: string) {
    try {
        const res = await fetch(`/api/posts/${slug}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data.post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const post = await getPost(params.slug);

    if (!post || post.status !== 'published') {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
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
}

export default async function PostPage({ params }: PostPageProps) {
    const post = await getPost(params.slug);

    if (!post || post.status !== 'published') {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <article className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li>
                                <Link href="/" className="hover:text-primary-600">
                                    Home
                                </Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/posts" className="hover:text-primary-600">
                                    Posts
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="text-gray-900">{post.title}</li>
                        </ol>
                    </nav>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="mb-8">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Post Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.createdAt}>
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{post.readingTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{post.viewCount} views</span>
                            </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 mb-6">
                                <Tag className="w-4 h-4 text-gray-500" />
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: string) => (
                                        <Link
                                            key={tag}
                                            href={`/posts?tags=${tag}`}
                                            className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full hover:bg-primary-200 transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Excerpt */}
                        {post.excerpt && (
                            <div className="bg-gray-100 border-l-4 border-primary-500 p-4 rounded-r-lg">
                                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}
                    </header>

                    {/* Post Content */}
                    <div className="prose-custom max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Post Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <p>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href="/posts"
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    ← Back to Posts
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>
        </div>
    );
}

// If you want to use static export, you must provide all possible slugs here.
// For SSR/serverless, this is not required and can be omitted.
export async function generateStaticParams() {
    // Fetch all posts to generate static paths
    const res = await fetch('https://your-api-endpoint.com/api/posts', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts.map((post: { slug: string }) => ({ slug: post.slug }));
} 