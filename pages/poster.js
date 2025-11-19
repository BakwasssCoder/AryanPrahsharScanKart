import { useEffect } from 'react';

export default function Poster() {
    useEffect(() => {
        // Auto-print on load
        // window.print();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="border-8 border-sky-600 p-12 rounded-3xl max-w-2xl w-full">
                <h1 className="text-6xl font-extrabold text-sky-600 mb-4">ScanKart</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-12">School Marketplace</h2>

                <div className="mb-12">
                    <img src="/api/qrcode" alt="QR Code" className="w-96 h-96 mx-auto object-contain" />
                </div>

                <p className="text-4xl font-bold text-gray-900 mb-8">Scan to Buy & Sell</p>

                <div className="grid grid-cols-2 gap-8 text-left text-xl text-gray-700 max-w-lg mx-auto">
                    <ul className="list-disc space-y-2">
                        <li>Books</li>
                        <li>Uniforms</li>
                    </ul>
                    <ul className="list-disc space-y-2">
                        <li>Stationery</li>
                        <li>Notes</li>
                    </ul>
                </div>

                <div className="mt-12 text-gray-500">
                    <p>Open camera to scan • No app download required</p>
                </div>
            </div>
        </div>
    );
}
