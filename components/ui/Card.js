import { motion } from 'framer-motion';

export default function Card({ children, className, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
