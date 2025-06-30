'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postValidationSchema, PostFormData } from '@/lib/utils/validation';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';
import { Save, Eye, EyeOff } from 'lucide-react';

interface PostFormProps {
    initialData?: Partial<PostFormData>;
    onSubmit: (data: PostFormData) => Promise<void>;
    isSubmitting?: boolean;
    mode: 'create' | 'edit';
}

export default function PostForm({
    initialData,
    onSubmit,
    isSubmitting = false,
    mode
}: PostFormProps) {
    const [previewMode, setPreviewMode] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm<PostFormData>({
        resolver: zodResolver(postValidationSchema),
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || '',
            status: initialData?.status || 'draft',
            tags: initialData?.tags || [],
            featuredImage: initialData?.featuredImage || '',
            metaTitle: initialData?.metaTitle || '',
            metaDescription: initialData?.metaDescription || ''
        }
    });

    const watchedTitle = watch('title');
    const watchedContent = watch('content');

    // Auto-save functionality
    useEffect(() => {
        if (!isDirty || mode === 'edit') return;

        const autoSaveTimer = setTimeout(async () => {
            try {
                const formData = {
                    title: watchedTitle,
                    content: watchedContent,
                    status: 'draft' as const,
                    tags: [],
                    featuredImage: '',
                    metaTitle: '',
                    metaDescription: ''
                };

                // Only auto-save if we have minimum content
                if (formData.title.length >= 3 && formData.content.length >= 10) {
                    setAutoSaveStatus('Saving...');
                    await fetch('/api/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    setAutoSaveStatus('Auto-saved');
                    setTimeout(() => setAutoSaveStatus(''), 2000);
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
                setAutoSaveStatus('Auto-save failed');
            }
        }, 30000); // Auto-save every 30 seconds

        return () => clearTimeout(autoSaveTimer);
    }, [watchedTitle, watchedContent, isDirty, mode]);

    // Handle form submission
    const handleFormSubmit = async (data: PostFormData) => {
        try {
            await onSubmit(data);
            toast.success(`Post ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        } catch (error: any) {
            toast.error(error.message || `Failed to ${mode} post`);
        }
    };

    // Handle tag input
    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const input = e.currentTarget;
            const tag = input.value.trim().toLowerCase();
            const currentTags = watch('tags') || [];

            if (tag && !currentTags.includes(tag)) {
                setValue('tags', [...currentTags, tag]);
                input.value = '';
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = watch('tags') || [];
        setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Auto-save status */}
            {autoSaveStatus && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                    {autoSaveStatus}
                </div>
            )}

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                </label>
                <input
                    {...register('title')}
                    type="text"
                    id="title"
                    className="input-field"
                    placeholder="Enter post title..."
                    maxLength={200}
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
                <div className="mt-1 text-sm text-gray-500">
                    {watchedTitle.length}/200 characters
                </div>
            </div>

            {/* Content */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Content *
                    </label>
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                        {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                </div>

                {previewMode ? (
                    <div className="prose-custom border border-gray-300 rounded-lg p-4 min-h-[300px]">
                        <div dangerouslySetInnerHTML={{ __html: watchedContent }} />
                    </div>
                ) : (
                    <RichTextEditor
                        value={watchedContent}
                        onChange={(value) => setValue('content', value)}
                        placeholder="Start writing your content..."
                    />
                )}

                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
            </div>

            {/* Status */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                </label>
                <select
                    {...register('status')}
                    id="status"
                    className="input-field"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Tags */}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                </label>
                <input
                    type="text"
                    id="tags"
                    className="input-field"
                    placeholder="Type tags and press Enter or comma..."
                    onKeyDown={handleTagInput}
                />
                {(watch('tags') || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('tags') || []).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-primary-600 hover:text-primary-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Featured Image */}
            <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                </label>
                <input
                    {...register('featuredImage')}
                    type="url"
                    id="featuredImage"
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                />
                {errors.featuredImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.featuredImage.message}</p>
                )}
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>

                {/* Meta Title */}
                <div className="mb-4">
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                    </label>
                    <input
                        {...register('metaTitle')}
                        type="text"
                        id="metaTitle"
                        className="input-field"
                        placeholder="SEO title (optional)"
                        maxLength={60}
                    />
                    {errors.metaTitle && (
                        <p className="mt-1 text-sm text-red-600">{errors.metaTitle.message}</p>
                    )}
                    <div className="mt-1 text-sm text-gray-500">
                        {(watch('metaTitle') || '').length}/60 characters
                    </div>
                </div>

                {/* Meta Description */}
                <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                    </label>
                    <textarea
                        {...register('metaDescription')}
                        id="metaDescription"
                        rows={3}
                        className="input-field"
                        placeholder="SEO description (optional)"
                        maxLength={160}
                    />
                    {errors.metaDescription && (
                        <p className="mt-1 text-sm text-red-600">{errors.metaDescription.message}</p>
                    )}
                    <div className="mt-1 text-sm text-gray-500">
                        {(watch('metaDescription') || '').length}/160 characters
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : `Save ${mode === 'create' ? 'Post' : 'Changes'}`}
                </button>

                <button
                    type="button"
                    onClick={() => setValue('status', 'draft')}
                    className="btn-secondary"
                >
                    Save as Draft
                </button>
            </div>
        </form>
    );
} 