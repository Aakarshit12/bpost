'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { PostFormData } from '@/lib/utils/validation';
import toast from 'react-hot-toast';

export default function NewPostPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: PostFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create post');
            }

            const result = await response.json();

            // Redirect to the new post or admin dashboard
            if (data.status === 'published') {
                router.push(`/posts/${result.post.slug}`);
            } else {
                router.push('/admin');
            }

        } catch (error: any) {
            console.error('Error creating post:', error);
            toast.error(error.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
                        <p className="text-gray-600 mt-2">
                            Write and publish your next blog post with our comprehensive editor.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="card">
                        <PostForm
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            mode="create"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 