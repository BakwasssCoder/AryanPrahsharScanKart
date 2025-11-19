import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ItemDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch current user for personalized message
        fetch('/api/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => setCurrentUser(data?.user));
    }, []);

    useEffect(() => {
        if (id) {
            fetch(`/api/items/${id}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Item not found');
                })
                .then(data => {
                    setItem(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const res = await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
        if (res.ok) {
            router.push('/buy');
        } else {
            alert('Failed to delete item');
        }
    };

    if (loading) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;
    if (!item) return <Layout><div className="p-8 text-center">Item not found</div></Layout>;

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in your ${item.name} listed on ScanKart. Is it still available?` +
        (currentUser ? ` - ${currentUser.name}` : '')
    );
    const whatsappLink = `https://wa.me/${item.seller_phone}?text=${whatsappMessage}`;

    const isOwner = currentUser && currentUser.id === item.seller_id;
    const isAdmin = currentUser && currentUser.role === 'admin';

    return (
        <Layout title={`${item.name} - ScanKart`}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="md:flex">
                    <div className="md:w-1/2 p-4 bg-gray-100 flex items-center justify-center">
                        {item.image_base64 ? (
                            <img src={item.image_base64} alt={item.name} className="max-h-96 max-w-full object-contain" />
                        ) : (
                            <div className="text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-sky-100 text-sky-800">
                                    {item.condition}
                                </span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-sky-600">₹{item.price}</p>

                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                <p className="mt-2 text-gray-500">{item.description}</p>
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Seller Details</h3>
                                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{item.seller_name}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">School</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{item.seller_school}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Class</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{item.seller_class}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Exchange Place</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{item.preferred_exchange_place || 'Not specified'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="mt-8 flex space-x-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-green-500 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Chat on WhatsApp
                            </a>

                            {(isOwner || isAdmin) && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-100 text-red-700 px-6 py-3 rounded-md font-medium hover:bg-red-200 transition-colors"
                                >
                                    Delete Item
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
