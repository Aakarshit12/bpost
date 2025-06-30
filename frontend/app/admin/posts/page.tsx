'use client';

import { useEffect, useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search, Filter, Calendar, FileText } from 'lucide-react';
import AdminPostsTable from './AdminPostsTable';

export default function AdminPostsPage() {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalPosts: 0, limit: 10 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (status) params.append('status', status);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortOrder) params.append('sortOrder', sortOrder);
                params.append('page', pagination.currentPage.toString());

                const res = await fetch(`/api/posts?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.posts || []);
                    setPagination({ ...pagination, ...data.pagination });
                }
            } catch (error) {
                setPosts([]);
                setPagination({ currentPage: 1, totalPages: 1, totalPosts: 0, limit: 10 });
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, status, sortBy, sortOrder, pagination.currentPage]);

    function handleFilterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPagination({ ...pagination, currentPage: 1 });
        // fetchPosts will be triggered by useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Posts</h1>
                        <p className="text-gray-600 mt-2">Create, edit, and manage your blog posts</p>
                    </div>
                    <Link
                        href="/admin/posts/new"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="card mb-8">
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleFilterSubmit}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search posts..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            name="status"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            name="sortBy"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="updatedAt">Updated Date</option>
                            <option value="title">Title</option>
                            <option value="viewCount">Views</option>
                        </select>

                        <select
                            name="sortOrder"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>

                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2 md:col-span-4"
                        >
                            <Filter className="w-4 h-4" />
                            Apply Filters
                        </button>
                    </form>
                </div>

                {/* Posts Table */}
                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading posts...</div>
                ) : (
                    <AdminPostsTable posts={posts} />
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalPosts)} of {pagination.totalPosts} posts
                        </div>
                        <div className="flex items-center gap-2">
                            {pagination.currentPage > 1 && (
                                <button
                                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                            )}

                            <span className="px-4 py-2 text-gray-600">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>

                            {pagination.currentPage < pagination.totalPages && (
                                <button
                                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 