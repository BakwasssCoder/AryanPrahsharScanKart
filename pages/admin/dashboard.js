import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then(res => {
                if (res.status === 403) {
                    router.push('/');
                    throw new Error('Forbidden');
                }
                return res.json();
            })
            .then(data => {
                setStats(data.stats);
                setRecentItems(data.recentItems);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setRecentItems(prev => prev.filter(i => i.id !== id));
        }
    };

    if (loading) return <Layout><div className="p-8">Loading...</div></Layout>;

    return (
        <Layout title="Admin Dashboard - ScanKart">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.items}</dd>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.users}</dd>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {recentItems.map((item) => (
                            <li key={item.id}>
                                <div className="px-4 py-4 flex items-center sm:px-6">
                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div className="truncate">
                                            <div className="flex text-sm">
                                                <p className="font-medium text-sky-600 truncate">{item.name}</p>
                                                <p className="ml-1 flex-shrink-0 font-normal text-gray-500">in {item.category}</p>
                                            </div>
                                            <div className="mt-2 flex">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <p>
                                                        Price: ₹{item.price} | Condition: {item.condition}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-5 flex-shrink-0">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
