import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Search, Filter } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog Posts',
    description: 'Explore our collection of insightful blog posts covering technology, development, and industry insights.',
    openGraph: {
        title: 'Blog Posts | Blog',
        description: 'Explore our collection of insightful blog posts covering technology, development, and industry insights.',
    },
};

interface PostsPageProps {
    searchParams: {
        page?: string;
        search?: string;
        tags?: string;
        status?: string;
    };
}

async function getPosts(searchParams: PostsPageProps['searchParams']) {
    try {
        const params = new URLSearchParams();

        if (searchParams.page) params.append('page', searchParams.page);
        if (searchParams.search) params.append('search', searchParams.search);
        if (searchParams.tags) params.append('tags', searchParams.tags);
        if (searchParams.status) params.append('status', searchParams.status);

        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/posts?${params.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], pagination: { currentPage: 1, totalPages: 1, totalPosts: 0 } };
    }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
    const { posts, pagination } = await getPosts(searchParams);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Blog Posts
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover insightful articles, tutorials, and stories written with passion and expertise.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8">
                    <form className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search posts..."
                                defaultValue={searchParams.search}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Search
                        </button>
                    </form>
                </div>

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {posts.map((post: any) => (
                                <article key={post._id} className="card hover:shadow-lg transition-shadow duration-300">
                                    {post.featuredImage && (
                                        <div className="mb-4">
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {post.author}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readingTime} min read
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                                        >
                                            Read More
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex gap-1">
                                                {post.tags.slice(0, 2).map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {pagination.currentPage > 1 && (
                                    <Link
                                        href={`/posts?page=${pagination.currentPage - 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.tags ? `&tags=${searchParams.tags}` : ''}`}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}

                                <span className="px-4 py-2 text-gray-600">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>

                                {pagination.currentPage < pagination.totalPages && (
                                    <Link
                                        href={`/posts?page=${pagination.currentPage + 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.tags ? `&tags=${searchParams.tags}` : ''}`}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                        <p className="text-gray-600">
                            {searchParams.search
                                ? `No posts match your search for "${searchParams.search}"`
                                : 'No posts are available at the moment.'
                            }
                        </p>
                        {searchParams.search && (
                            <Link
                                href="/posts"
                                className="btn-primary mt-4 inline-flex items-center gap-2"
                            >
                                Clear Search
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 