import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    status: 'draft' | 'published' | 'archived';
    featuredImage?: string;
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
    author: string;
    viewCount: number;
    isDeleted: boolean;
    readingTime: number;
    createdAt: Date;
    updatedAt: Date;
}

// Helper functions
async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = 'untitled';
    if (baseSlug.length > 100) baseSlug = baseSlug.substring(0, 100);

    let finalSlug = baseSlug;
    let counter = 1;

    while (await slugExists(finalSlug, excludeId)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;

        if (counter > 1000) {
            finalSlug = `${baseSlug}-${Date.now()}`;
            break;
        }
    }

    return finalSlug;
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: any = { slug, isDeleted: false };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const existing = await mongoose.model('Post').findOne(query);
    return !!existing;
}

function generateExcerpt(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 300 ? plainText.substring(0, 300) + '...' : plainText;
}

const PostSchema = new Schema<IPost>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
        minlength: [3, 'Title must be at least 3 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at least 10 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    featuredImage: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
            },
            message: 'Featured image must be a valid image URL'
        }
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    metaTitle: {
        type: String,
        maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    author: {
        type: String,
        default: 'Admin',
        trim: true
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for reading time estimation
PostSchema.virtual('readingTime').get(function () {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-validate middleware for slug generation
PostSchema.pre('validate', async function (next) {
    if ((this.isNew || this.isModified('title')) && this.title) {
        this.slug = await generateUniqueSlug(this.title, this._id?.toString());
    }
    if ((this.isNew || this.isModified('content')) && this.content) {
        this.excerpt = this.excerpt || generateExcerpt(this.content);
    }
    console.log('Validating post:', { title: this.title, slug: this.slug });
    next();
});

// Create indexes for better query performance
PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ isDeleted: 1, status: 1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema); 