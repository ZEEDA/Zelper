import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
    color: string; // e.g., 'bg-blue-500'
    children?: React.ReactNode;
}

export default function FeatureCard({ title, description, icon, to, color, children }: FeatureCardProps) {
    return (
        <Link
            to={to}
            className="block h-full group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.02]"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
                    <div className="text-current">
                        {icon}
                    </div>
                </div>
                <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">{description}</p>

            {children && (
                <div className="pt-4 border-t border-gray-100">
                    {children}
                </div>
            )}
        </Link>
    );
}
