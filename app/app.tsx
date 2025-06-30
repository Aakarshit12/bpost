// This is the index (home) page for the site. Next.js requires this file to be named page.tsx in the app directory.

'use client';

import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts?limit=6&status=published');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts || []);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Welcome to Our Blog
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Discover insightful articles, tutorials, and stories written with passion and expertise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/posts"
                                className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
                            >
                                Explore Posts
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/admin"
                                className="btn-secondary text-lg px-8 py-3 bg-white/10 hover:bg-white/20 text-white border-white/20"
                            >
                                Admin Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Posts Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Featured Posts
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our latest articles covering technology, development, and industry insights.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Loading posts...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                No posts available yet. Check back soon for new content!
                            </p>
                        </div>
                    )}

                    {posts.length > 0 && (
                        <div className="text-center mt-12">
                            <Link
                                href="/posts"
                                className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
                            >
                                View All Posts
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Blog?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Built with modern technologies and best practices for an exceptional reading experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Performance</h3>
                            <p className="text-gray-600">
                                Built with Next.js 14+ for optimal speed and user experience.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                            <p className="text-gray-600">
                                Comprehensive security measures and robust error handling.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rich Content</h3>
                            <p className="text-gray-600">
                                Engaging articles with rich formatting and multimedia support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 