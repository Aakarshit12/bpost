import { Metadata } from 'next';
import PostsList from './PostsList';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: 'Blog Posts',
    description: 'Explore our collection of insightful blog posts covering technology, development, and industry insights.',
    openGraph: {
        title: 'Blog Posts | Blog',
        description: 'Explore our collection of insightful blog posts covering technology, development, and industry insights.',
    },
};

export default function PostsPage() {
    return <PostsList />;
} 