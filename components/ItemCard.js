import Link from 'next/link';
import Card from './ui/Card';
import Button from './ui/Button';

export default function ItemCard({ item }) {
    return (
        <Card className="group h-full flex flex-col">
            <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
                {item.image_base64 ? (
                    <img
                        src={item.image_base64}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                        <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full shadow-sm text-gray-800 border border-gray-100">
                        {item.condition}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium truncate">{item.seller_school}</p>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                    <span className="text-lg font-extrabold text-primary-600">₹{item.price}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{item.description || "No description provided."}</p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <Link href={`/item/${item.id}`}>
                        <span className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center group-hover:translate-x-1 transition-transform">
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </span>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
