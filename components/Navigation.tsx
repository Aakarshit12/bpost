'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Home, FileText, Settings } from 'lucide-react';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Blog</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <Link
                            href="/posts"
                            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                            <FileText className="w-4 h-4" />
                            Posts
                        </Link>
                        <Link
                            href="/admin"
                            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                            <Settings className="w-4 h-4" />
                            Admin
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                href="/posts"
                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FileText className="w-4 h-4" />
                                Posts
                            </Link>
                            <Link
                                href="/admin"
                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                Admin
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 