"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AdminPostsTableProps {
    posts: any[];
}

export default function AdminPostsTable({ posts }: AdminPostsTableProps) {
    const router = useRouter();
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
    const [publishingSlug, setPublishingSlug] = useState<string | null>(null);

    async function handleDelete(slug: string) {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        setDeletingSlug(slug);
        const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
        setDeletingSlug(null);
        if (res.ok) router.refresh();
        else alert('Failed to delete post');
    }

    async function handlePublish(slug: string) {
        setPublishingSlug(slug);
        const res = await fetch(`/api/posts/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'published' })
        });
        setPublishingSlug(null);
        if (res.ok) router.refresh();
        else alert('Failed to publish post');
    }

    return (
        <div className="card">
            {posts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Views</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post: any) => (
                                <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {post.tags.slice(0, 2).map((tag: string) => (
                                                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : post.status === 'draft'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{post.author}</td>
                                    <td className="py-4 px-4 text-gray-600">{format(new Date(post.createdAt), 'dd/MM/yyyy')}</td>
                                    <td className="py-4 px-4 text-gray-600">{post.viewCount || 0}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {post.status === 'published' ? (
                                                <Link href={`/posts/${post.slug}`} className="p-2 text-gray-400 hover:text-gray-600" title="View Post">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            ) : (
                                                <span className="p-2 text-gray-200 cursor-not-allowed" title="Cannot view draft">
                                                    <Eye className="w-4 h-4" />
                                                </span>
                                            )}
                                            <Link href={`/admin/posts/${post.slug}/edit`} className="p-2 text-gray-400 hover:text-primary-600" title="Edit Post">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            {post.status === 'draft' && (
                                                <button
                                                    className="p-2 text-gray-400 hover:text-green-600"
                                                    title="Publish Post"
                                                    onClick={() => handlePublish(post.slug)}
                                                    disabled={publishingSlug === post.slug}
                                                >
                                                    {publishingSlug === post.slug ? 'Publishing...' : 'Publish'}
                                                </button>
                                            )}
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-600"
                                                title="Delete Post"
                                                onClick={() => handleDelete(post.slug)}
                                                disabled={deletingSlug === post.slug}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                </div>
            )}
        </div>
    );
} 