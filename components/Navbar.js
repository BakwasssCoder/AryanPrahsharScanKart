import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

export default function Navbar({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.reload();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:scale-105 transition-transform duration-200">
                                ScanKart
                            </span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link href="/buy" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${router.pathname === '/buy' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-300'}`}>
                                Buy
                            </Link>
                            <Link href="/sell" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${router.pathname === '/sell' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-primary-600 hover:border-primary-300'}`}>
                                Sell
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                    Hi, {user.name}
                                </span>
                                {user.role === 'admin' && (
                                    <Link href="/admin/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <Button variant="ghost" onClick={handleLogout} className="!px-4 !py-2 text-sm">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="!px-4 !py-2">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" className="!px-4 !py-2 shadow-lg shadow-primary-500/20">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sm:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="pt-2 pb-3 space-y-1 px-4">
                            <Link href="/buy" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">
                                Buy
                            </Link>
                            <Link href="/sell" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">
                                Sell
                            </Link>
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-100 px-4">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="px-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.phone}</div>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link href="/admin/dashboard" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Button variant="danger" onClick={handleLogout} className="w-full justify-start">
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 px-3">
                                    <Link href="/login" className="block">
                                        <Button variant="outline" className="w-full justify-center">Login</Button>
                                    </Link>
                                    <Link href="/register" className="block">
                                        <Button variant="primary" className="w-full justify-center">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
