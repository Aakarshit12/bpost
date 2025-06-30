import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search, Filter, Calendar, FileText } from 'lucide-react';
import AdminPostsTable from './AdminPostsTable';

export const metadata: Metadata = {
    title: 'Manage Posts',
    description: 'Admin panel for managing blog posts.',
};

interface AdminPostsPageProps {
    searchParams: {
        page?: string;
        search?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

async function getAdminPosts(searchParams: AdminPostsPageProps['searchParams']) {
    try {
        const params = new URLSearchParams();

        if (searchParams.page) params.append('page', searchParams.page);
        if (searchParams.search) params.append('search', searchParams.search);
        if (searchParams.status) params.append('status', searchParams.status);
        if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);
        if (searchParams.sortOrder) params.append('sortOrder', searchParams.sortOrder);

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

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
    const { posts, pagination } = await getAdminPosts(searchParams);

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
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search posts..."
                                defaultValue={searchParams.search}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            name="status"
                            defaultValue={searchParams.status || ''}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            name="sortBy"
                            defaultValue={searchParams.sortBy || 'createdAt'}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="updatedAt">Updated Date</option>
                            <option value="title">Title</option>
                            <option value="viewCount">Views</option>
                        </select>

                        <select
                            name="sortOrder"
                            defaultValue={searchParams.sortOrder || 'desc'}
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
                <AdminPostsTable posts={posts} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalPosts)} of {pagination.totalPosts} posts
                        </div>
                        <div className="flex items-center gap-2">
                            {pagination.currentPage > 1 && (
                                <Link
                                    href={`/admin/posts?page=${pagination.currentPage - 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
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
                                    href={`/admin/posts?page=${pagination.currentPage + 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 