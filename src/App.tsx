import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ReadingPage from './pages/ReadingPage';
import ExpensesPage from './pages/ExpensesPage';
import InsightsPage from './pages/InsightsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/reading" element={<ReadingPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/insights" element={<InsightsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
