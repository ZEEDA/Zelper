import { create } from 'zustand';
import api from '../utils/api';

export interface Task {
    id: number;
    userId: number;
    workSessionId?: number | null;
    title: string;
    estimatedMinutes?: number | null;
    actualMinutes: number;
    completed: boolean;
    startedAt?: string | null;
    completedAt?: string | null;
    createdAt: string;
}

interface TasksState {
    tasks: Task[];
    activeTaskId: number | null;
    isLoading: boolean;
    error: string | null;

    fetchTasks: () => Promise<void>;
    addTask: (title: string, estimatedMinutes?: number, workSessionId?: number) => Promise<void>;
    updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    toggleComplete: (id: number, completed: boolean) => Promise<void>;
    startTimer: (id: number) => Promise<void>;
    stopTimer: (id: number) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
    tasks: [],
    activeTaskId: null,
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/tasks');
            set({ tasks: response.data.tasks });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch tasks' });
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (title, estimatedMinutes, workSessionId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/tasks', { title, estimatedMinutes, workSessionId });
            set((state) => ({ tasks: [response.data.task, ...state.tasks] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add task' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateTask: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/tasks/${id}`, updates);
            set((state) => ({
                tasks: state.tasks.map((task) => (task.id === id ? response.data.task : task)),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to update task' });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/tasks/${id}`);
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete task' });
        } finally {
            set({ isLoading: false });
        }
    },

    toggleComplete: async (id, completed) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/tasks/${id}/complete`, { completed });
            set((state) => ({
                tasks: state.tasks.map((task) => (task.id === id ? response.data.task : task)),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to toggle completion' });
        } finally {
            set({ isLoading: false });
        }
    },

    startTimer: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // Stop any other running timer first? Backend might handle this or frontend logic needed
            // For now, assuming backend handles logic of "one task at a time" if needed
            const response = await api.put(`/tasks/${id}/timer`, { status: 'start' });
            set((state) => ({
                activeTaskId: id,
                tasks: state.tasks.map(t => t.id === id ? response.data.task : t)
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to start timer' });
        } finally {
            set({ isLoading: false });
        }
    },

    stopTimer: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/tasks/${id}/timer`, { status: 'stop' });
            set((state) => ({
                activeTaskId: null,
                tasks: state.tasks.map(t => t.id === id ? response.data.task : t)
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to stop timer' });
        } finally {
            set({ isLoading: false });
        }
    }
}));
