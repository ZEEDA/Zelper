import { create } from 'zustand';
import api from '../utils/api';

interface User {
    id: number;
    email: string;
    name?: string;
    daily_budget?: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (email, password, name) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/register', { email, password, name });
            localStorage.setItem('token', data.token);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            const { data } = await api.get('/auth/me');
            set({ user: data.user, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },
}));
