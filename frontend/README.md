# Comprehensive Blog Website

A production-ready blog website built with Next.js 14+, MongoDB, and rich text editing capabilities. This system handles all edge cases, provides robust error handling, and includes comprehensive security measures.

## 🚀 Features

### Core Features
- **Next.js 14+ with App Router** - Modern React framework with server-side rendering
- **MongoDB with Mongoose** - Robust database with comprehensive schema validation
- **Rich Text Editor** - React-Quill with full formatting capabilities
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Modern, responsive design system
- **SEO Optimized** - Dynamic meta tags, sitemap, and RSS feeds

### Advanced Features
- **Comprehensive Validation** - Zod schemas for all form inputs
- **Security Measures** - XSS prevention, input sanitization, rate limiting
- **Auto-save Functionality** - Automatic draft saving every 30 seconds
- **Slug Generation** - SEO-friendly URLs with conflict resolution
- **Soft Delete** - Safe post deletion with recovery options
- **View Count Tracking** - Atomic view count increments
- **Tag System** - Flexible tagging with filtering
- **Status Management** - Draft, published, and archived states

### Admin Features
- **Dashboard** - Overview with statistics and quick actions
- **Post Management** - Create, edit, delete, and preview posts
- **Rich Text Editor** - Full formatting toolbar with preview mode
- **SEO Settings** - Meta title and description management
- **Bulk Operations** - Manage multiple posts efficiently

### Public Features
- **Responsive Design** - Mobile-first approach
- **Search & Filtering** - Find posts by title, content, or tags
- **Pagination** - Server-side pagination for performance
- **Reading Time** - Automatic calculation based on content
- **Social Sharing** - Open Graph and Twitter Card support

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+, React 18+, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Rich Text Editor**: React-Quill
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Security**: DOMPurify for XSS prevention

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd comprehensive-blog-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit your environment file with your configuration:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-db?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Image upload service
UPLOADCARE_PUBLIC_KEY=your-uploadcare-key

# Optional: Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Note:** Create your environment file locally and never commit it to version control for security.

### 4. Database Setup

Ensure your MongoDB database is running and accessible. The application will automatically create the necessary collections and indexes.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes
│   ├── posts/             # Public post pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── PostForm.tsx       # Post creation/editing form
│   └── RichTextEditor.tsx # Rich text editor component
├── lib/                   # Utility libraries
│   ├── database.ts        # MongoDB connection
│   ├── models/            # Mongoose models
│   └── utils/             # Helper utilities
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔧 API Endpoints

### Posts API

- `GET /api/posts` - List posts with pagination and filtering
- `POST /api/posts` - Create a new post
- `GET /api/posts/[slug]` - Get a specific post
- `PUT /api/posts/[slug]` - Update a post
- `DELETE /api/posts/[slug]` - Soft delete a post

### SEO & Syndication

- `GET /api/sitemap` - Generate XML sitemap
- `GET /api/rss` - Generate RSS feed
- `GET /api/robots` - Robots.txt file

## 🛡️ Security Features

### Input Validation
- Comprehensive Zod schemas for all inputs
- HTML sanitization using DOMPurify
- URL validation for images and links
- Slug format validation

### Rate Limiting
- API rate limiting (10 requests per hour per IP)
- Request validation and sanitization
- Error handling with meaningful messages

### XSS Prevention
- HTML content sanitization
- Allowed tags and attributes whitelist
- Data attribute restrictions

## 📊 Database Schema

### Post Model
```typescript
{
  title: string (3-200 chars, required)
  content: string (min 10 chars, required)
  slug: string (unique, auto-generated)
  excerpt: string (max 300 chars, auto-generated)
  status: 'draft' | 'published' | 'archived'
  featuredImage: string (valid URL, optional)
  tags: string[] (lowercase, trimmed)
  metaTitle: string (max 60 chars, optional)
  metaDescription: string (max 160 chars, optional)
  author: string (default: 'Admin')
  viewCount: number (default: 0)
  isDeleted: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
```

**Note:** Set these environment variables in your deployment platform (Vercel, Netlify, etc.) for production deployment.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Roadmap

- [ ] User authentication and authorization
- [ ] Comments system
- [ ] Image upload service integration
- [ ] Advanced search with Elasticsearch
- [ ] Email newsletter integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

## 🤝 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database
- React Quill for the rich text editor
- Tailwind CSS for the styling system
- All contributors and maintainers 