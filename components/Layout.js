import Navbar from './Navbar';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Layout({ children, title = 'ScanKart' }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{title}</title>
                <meta name="description" content="School marketplace for students" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar user={user} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
