import { z } from 'zod';

export const postValidationSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title cannot exceed 200 characters')
        .trim(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters'),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    tags: z.array(z.string().trim().toLowerCase()).optional(),
    featuredImage: z.string().url().optional().or(z.literal('')),
    metaTitle: z.string().max(60, 'Meta title cannot exceed 60 characters').optional(),
    metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional()
});

export const updatePostSchema = postValidationSchema.partial();

export const searchQuerySchema = z.object({
    page: z.string().transform(Number).pipe(z.number().min(1).max(1000)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default('10'),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    search: z.string().optional(),
    tags: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'viewCount', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type PostFormData = z.infer<typeof postValidationSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type SearchQueryParams = z.infer<typeof searchQuerySchema>; 