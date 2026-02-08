import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setStatus('loading');
        setMessage('');

        try {
            await api.post('/auth/reset-password', { token, password });
            setStatus('success');
            setMessage('Password has been reset successfully');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Failed to reset password');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
                    <p className="text-gray-600 mb-6">The password reset link is invalid or missing.</p>
                    <Link to="/login" className="btn btn-primary w-full py-3 inline-block">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {status === 'error' && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {message}
                            <div className="mt-2 text-xs">Redirecting to login...</div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pr-10"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
