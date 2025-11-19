import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
    children,
    variant = 'primary',
    className,
    isLoading,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

    const variants = {
        primary: "border-transparent text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 shadow-sky-500/30",
        secondary: "border-transparent text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 shadow-purple-500/30",
        outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-sky-500 hover:border-gray-400",
        ghost: "border-transparent text-sky-600 bg-transparent hover:bg-sky-50 hover:text-sky-700 shadow-none",
        danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/30"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : children}
        </button>
    );
}
