"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, User, ArrowRight, Search, Filter } from "lucide-react";

export default function PostsList() {
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalPosts: 0 });
    const [loading, setLoading] = useState(true);

    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const tags = searchParams.get("tags") || "";
    const status = searchParams.get("status") || "";

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (page) params.append("page", page);
                if (search) params.append("search", search);
                if (tags) params.append("tags", tags);
                if (status) params.append("status", status);
                const res = await fetch(`/api/posts?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();
                setPosts(data.posts || []);
                setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalPosts: 0 });
            } catch (error) {
                setPosts([]);
                setPagination({ currentPage: 1, totalPages: 1, totalPosts: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, tags, status]);

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
                                defaultValue={search}
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
                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading posts...</div>
                ) : posts.length > 0 ? (
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
                                        href={`/posts?page=${pagination.currentPage - 1}${search ? `&search=${search}` : ''}${tags ? `&tags=${tags}` : ''}`}
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
                                        href={`/posts?page=${pagination.currentPage + 1}${search ? `&search=${search}` : ''}${tags ? `&tags=${tags}` : ''}`}
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
                            {search
                                ? `No posts match your search for "${search}"`
                                : 'No posts are available at the moment.'
                            }
                        </p>
                        {search && (
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