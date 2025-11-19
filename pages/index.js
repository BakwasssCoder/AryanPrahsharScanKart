import Layout from '../components/Layout';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <Layout>
            <div className="relative overflow-hidden">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl"
                                >
                                    <span className="block xl:inline">Buy & Sell</span>{' '}
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 xl:inline">School Supplies</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                                >
                                    ScanKart is the easiest way for students to trade books, uniforms, and stationery. Scan, list, and sell within your school community securely.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4"
                                >
                                    <Link href="/buy">
                                        <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-primary-500/30">
                                            Start Buying
                                        </Button>
                                    </Link>
                                    <Link href="/sell">
                                        <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-secondary-500/30">
                                            Sell Item
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* QR Code Graphic */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center rounded-bl-[100px]"
                >
                    <div className="text-center p-10 bg-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img
                            className="h-72 w-72 object-contain mx-auto mix-blend-multiply"
                            src="/api/qrcode"
                            alt="ScanKart QR Code"
                        />
                        <p className="mt-6 text-gray-600 font-bold text-lg tracking-wide uppercase">Scan to open</p>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-16">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How it works</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Simple, Safe, School-Focused
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-10">
                            {[
                                { title: 'List your item', desc: 'Take a photo, add details, and set a price. It takes less than a minute.', icon: '📸', color: 'bg-blue-100 text-blue-600' },
                                { title: 'Connect via WhatsApp', desc: 'Buyers contact you directly through WhatsApp to arrange the exchange.', icon: '💬', color: 'bg-green-100 text-green-600' },
                                { title: 'Meet & Exchange', desc: 'Meet at school or a safe place to hand over the item and get paid.', icon: '🤝', color: 'bg-purple-100 text-purple-600' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="relative bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                                >
                                    <dt>
                                        <div className={`absolute flex items-center justify-center h-14 w-14 rounded-2xl ${feature.color} text-2xl shadow-sm`}>
                                            {feature.icon}
                                        </div>
                                        <p className="ml-20 text-xl leading-6 font-bold text-gray-900">{feature.title}</p>
                                    </dt>
                                    <dd className="mt-4 ml-20 text-base text-gray-500 leading-relaxed">
                                        {feature.desc}
                                    </dd>
                                </motion.div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
