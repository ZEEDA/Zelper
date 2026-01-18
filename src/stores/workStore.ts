import { create } from 'zustand';
import api from '../utils/api';

export interface WorkSession {
    id: number;
    user_id: number;
    check_in_time: string;
    check_out_time?: string;
    status: 'checked_in' | 'on_break' | 'checked_out';
    total_work_minutes: number;
    total_break_minutes: number;
    timeline_json?: string;
}

interface WorkState {
    currentSession: WorkSession | null;
    status: 'checked_in' | 'on_break' | 'checked_out';
    isLoading: boolean;
    error: string | null;

    fetchTodaySession: () => Promise<void>;
    checkIn: () => Promise<void>;
    checkOut: () => Promise<void>;
    startBreak: () => Promise<void>;
    endBreak: () => Promise<void>;
}

export const useWorkStore = create<WorkState>((set, get) => ({
    currentSession: null,
    status: 'checked_out',
    isLoading: false,
    error: null,

    fetchTodaySession: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/work/today');
            if (response.data) {
                set({
                    currentSession: response.data,
                    status: response.data.status,
                });
            } else {
                set({ currentSession: null, status: 'checked_out' });
            }
        } catch (error: any) {
            console.error('Failed to fetch today session:', error);
            // If 404, it just means no session today, which is fine
            if (error.response?.status !== 404) {
                set({ error: error.message || 'Failed to fetch session' });
            } else {
                set({ currentSession: null, status: 'checked_out' });
            }
        } finally {
            set({ isLoading: false });
        }
    },

    checkIn: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/work/check-in');
            set({
                currentSession: response.data,
                status: 'checked_in',
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to check in' });
        } finally {
            set({ isLoading: false });
        }
    },

    checkOut: async () => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/work/check-out/${currentSession.id}`);
            set({
                currentSession: response.data,
                status: 'checked_out',
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to check out' });
        } finally {
            set({ isLoading: false });
        }
    },

    startBreak: async () => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/work/break/${currentSession.id}`, { action: 'start' });
            set({
                currentSession: response.data,
                status: 'on_break',
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to start break' });
        } finally {
            set({ isLoading: false });
        }
    },

    endBreak: async () => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/work/break/${currentSession.id}`, { action: 'end' });
            set({
                currentSession: response.data,
                status: 'checked_in',
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to end break' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
