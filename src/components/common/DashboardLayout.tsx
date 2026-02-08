import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SessionStatusHeader from './SessionStatusHeader';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardLayout() {
    const { logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 relative flex flex-col">
                <SessionStatusHeader />
                <div className="container mx-auto flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
