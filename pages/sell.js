import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Sell() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        condition: 'Good',
        category: 'book',
        preferred_exchange_place: '',
        imageBase64: ''
    });

    useEffect(() => {
        fetch('/api/me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => setUser(data.user))
            .catch(() => router.push('/login'));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1.5 * 1024 * 1024) {
                alert("Image size must be less than 1.5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/buy');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to list item');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Layout title="Sell Item - ScanKart">
            <div className="max-w-3xl mx-auto py-8">
                <Card className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">List an Item</h1>
                        <p className="text-gray-500 mt-2">Fill in the details to sell your item to other students.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Item Name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Class 10 Math Textbook"
                        />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white focus:ring-primary-500 sm:text-sm transition-colors"
                                placeholder="Describe the condition, edition, etc."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Price (₹)"
                                type="number"
                                name="price"
                                required
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                            />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white focus:ring-primary-500 sm:text-sm transition-colors"
                                >
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white focus:ring-primary-500 sm:text-sm transition-colors"
                                >
                                    <option value="book">Book</option>
                                    <option value="notes">Notes</option>
                                    <option value="stationery">Stationery</option>
                                    <option value="uniform">Uniform</option>
                                    <option value="kit">Lab Kit/Other</option>
                                </select>
                            </div>

                            <Input
                                label="Preferred Exchange Place"
                                name="preferred_exchange_place"
                                placeholder="e.g. Library, Canteen"
                                value={formData.preferred_exchange_place}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="space-y-1 text-center">
                                    {formData.imageBase64 ? (
                                        <div className="relative">
                                            <img src={formData.imageBase64} alt="Preview" className="mx-auto h-48 object-contain rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageBase64: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1.5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full text-lg py-4"
                            >
                                List Item
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}

