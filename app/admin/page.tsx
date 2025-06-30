import Link from 'next/link';
import { Metadata } from 'next';
import { Plus, Edit, Trash2, Eye, BarChart3, FileText, Users, Calendar } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin dashboard for managing blog posts and content.',
};

async function getDashboardStats() {
    try {
        const [postsRes, publishedRes, draftRes] = await Promise.all([
            fetch(`/api/posts?limit=1`, { cache: 'no-store' }),
            fetch(`/api/posts?status=published&limit=1`, { cache: 'no-store' }),
            fetch(`/api/posts?status=draft&limit=1`, { cache: 'no-store' })
        ]);

        const [postsData, publishedData, draftData] = await Promise.all([
            postsRes.json(),
            publishedRes.json(),
            draftRes.json()
        ]);

        return {
            totalPosts: postsData.pagination?.totalPosts || 0,
            publishedPosts: publishedData.pagination?.totalPosts || 0,
            draftPosts: draftData.pagination?.totalPosts || 0,
            recentPosts: postsData.posts?.slice(0, 5) || []
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            recentPosts: []
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your blog posts and content</p>
                    </div>
                    <Link
                        href="/admin/posts/new"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <FileText className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Eye className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Published</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Edit className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Drafts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.draftPosts}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link
                        href="/admin/posts"
                        className="card hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 text-primary-600" />
                            <span className="ml-2 font-medium">All Posts</span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/posts?status=published"
                        className="card hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center">
                            <Eye className="w-5 h-5 text-green-600" />
                            <span className="ml-2 font-medium">Published</span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/posts?status=draft"
                        className="card hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center">
                            <Edit className="w-5 h-5 text-yellow-600" />
                            <span className="ml-2 font-medium">Drafts</span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/posts/new"
                        className="card hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-center">
                            <Plus className="w-5 h-5 text-primary-600" />
                            <span className="ml-2 font-medium">New Post</span>
                        </div>
                    </Link>
                </div>

                {/* Recent Posts */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
                        <Link
                            href="/admin/posts"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    {stats.recentPosts.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentPosts.map((post: any) => (
                                <div
                                    key={post._id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : post.status === 'draft'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                            title="View Post"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/posts/${post.slug}/edit`}
                                            className="p-2 text-gray-400 hover:text-primary-600"
                                            title="Edit Post"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No posts yet. Create your first post to get started!</p>
                            <Link
                                href="/admin/posts/new"
                                className="btn-primary mt-4 inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Post
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 