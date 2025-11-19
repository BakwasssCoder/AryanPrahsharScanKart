import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Input({ label, error, className, ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary-500 focus:bg-white focus:ring-primary-500 sm:text-sm transition-colors duration-200 ease-in-out",
                    error && "border-red-300 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
            )}
        </div>
    );
}
