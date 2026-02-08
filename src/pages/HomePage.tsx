import { useAuthStore } from '../stores/authStore';
import FeatureCard from '../components/home/FeatureCard';
import SyncIndicator from '../components/common/SyncIndicator';
import { Clock, Book, DollarSign, BarChart2 } from 'lucide-react';

export default function HomePage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in pb-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hello, {user?.name || 'User'}
                    </h1>
                    <p className="text-gray-500 mt-1">Ready to be productive today?</p>
                </div>
                <SyncIndicator />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard
                    title="Work & Focus"
                    description="Track work sessions, manage tasks, and maintain productivity."
                    icon={<Clock size={24} />}
                    to="/work"
                    color="bg-blue-600"
                />

                <FeatureCard
                    title="Reading Assistant"
                    description="Manage your library, track reading progress (Paper & PDF)."
                    icon={<Book size={24} />}
                    to="/reading"
                    color="bg-purple-600"
                />

                <FeatureCard
                    title="Expense Tracker"
                    description="Monitor daily spending and stay within your budget."
                    icon={<DollarSign size={24} />}
                    to="/expenses"
                    color="bg-green-600"
                />

                <FeatureCard
                    title="Insights"
                    description="View weekly analytics and performance trends."
                    icon={<BarChart2 size={24} />}
                    to="/insights" // We'll disable or route to skeleton if not ready
                    color="bg-orange-500"
                />
            </div>
        </div>
    );
}
