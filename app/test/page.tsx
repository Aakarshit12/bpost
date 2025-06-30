import Link from 'next/link';

export default function TestPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🎉 Blog Website is Working!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Your comprehensive blog website is successfully running.
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/"
                            className="card hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏠 Home</h3>
                            <p className="text-gray-600">Visit the home page</p>
                        </Link>

                        <Link
                            href="/posts"
                            className="card hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Posts</h3>
                            <p className="text-gray-600">View all blog posts</p>
                        </Link>

                        <Link
                            href="/admin"
                            className="card hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Admin</h3>
                            <p className="text-gray-600">Access admin dashboard</p>
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-green-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            ✅ Features Working:
                        </h3>
                        <ul className="text-green-700 text-left space-y-1">
                            <li>• Next.js 14+ with App Router</li>
                            <li>• TypeScript configuration</li>
                            <li>• Tailwind CSS styling</li>
                            <li>• Navigation component</li>
                            <li>• Responsive design</li>
                            <li>• SEO optimization</li>
                        </ul>
                    </div>

                    <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            🔧 Next Steps:
                        </h3>
                        <ul className="text-blue-700 text-left space-y-1">
                            <li>• Set up MongoDB database</li>
                            <li>• Configure environment variables</li>
                            <li>• Create your first blog post</li>
                            <li>• Customize the design</li>
                            <li>• Deploy to production</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 