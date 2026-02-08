import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import WorkTodayPage from './pages/WorkTodayPage';
import WorkHistoryPage from './pages/WorkHistoryPage';
import ReadingPage from './pages/ReadingPage';
import ExpensesPage from './pages/ExpensesPage';
import InsightsPage from './pages/InsightsPage';
import TasksPage from './pages/TasksPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/work" element={<WorkHistoryPage />} />
                    <Route path="/work/today" element={<WorkTodayPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/reading" element={<ReadingPage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
