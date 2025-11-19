import Layout from '../components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        studentClass: '',
        school: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Registration form submitted', formData);
        setError('');
        setLoading(true);

        try {
            console.log('Sending request to /api/register');
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            console.log('Response received', res.status);

            const data = await res.json();
            console.log('Response data', data);

            if (res.ok) {
                console.log('Registration successful, redirecting...');
                router.push('/buy');
            } else {
                console.error('Registration failed', data.message);
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error', err);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Register - ScanKart">
            <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <Card className="py-8 px-4 sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <Input
                                label="Full Name"
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Phone Number"
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <Input
                                label="School Name"
                                id="school"
                                name="school"
                                type="text"
                                required
                                value={formData.school}
                                onChange={handleChange}
                            />

                            <Input
                                label="Class / Grade"
                                id="studentClass"
                                name="studentClass"
                                type="text"
                                required
                                placeholder="e.g. 10A"
                                value={formData.studentClass}
                                onChange={handleChange}
                            />

                            {error && (
                                <div className="text-red-600 text-sm">{error}</div>
                            )}

                            <div>
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full"
                                >
                                    Register
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
