import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, BookOpen, DollarSign, BarChart2, Clock, ClipboardList } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50';
    };

    const navItems = [
        { path: '/', icon: <Home size={20} />, label: 'Home' },
        { path: '/work', icon: <Briefcase size={20} />, label: 'Work' },
        { path: '/tasks', icon: <ClipboardList size={20} />, label: 'Tasks' },
        { path: '/reading', icon: <BookOpen size={20} />, label: 'Reading' },
        { path: '/expenses', icon: <DollarSign size={20} />, label: 'Expenses' },
        { path: '/insights', icon: <BarChart2 size={20} />, label: 'Insights' },
    ];

    return (
        <aside className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 z-20 hidden md:flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    Zelper
                </h1>
                <p className="text-xs text-gray-500 mt-1">Personal Assistant</p>
            </div>

            <nav className="flex-1 mt-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive(item.path)}`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 text-center">
                    &copy; {new Date().getFullYear()} Zelper
                </div>
            </div>
        </aside>
    );
}
