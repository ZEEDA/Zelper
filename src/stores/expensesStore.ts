import { create } from 'zustand';
import api from '../utils/api';

export interface Expense {
    id: number;
    user_id: number;
    amount: number;
    category: string;
    note?: string;
    created_at: string;
}

interface ExpensesState {
    expenses: Expense[];
    dailyBudget: number;
    isLoading: boolean;
    error: string | null;

    fetchExpenses: (date?: string) => Promise<void>;
    addExpense: (amount: number, category: string, note?: string) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;

    // Computed values (implemented as getters in components usually, or memoized here if needed)
    getDailyTotal: () => number;
    getCategoryBreakdown: () => Record<string, number>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
    expenses: [],
    dailyBudget: 0, // Should be fetched from user settings/profile
    isLoading: false,
    error: null,

    fetchExpenses: async (date) => {
        set({ isLoading: true, error: null });
        try {
            const params = date ? { date } : {}; // Pass date filter if provided
            const response = await api.get('/expenses', { params });
            set({ expenses: response.data });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch expenses' });
        } finally {
            set({ isLoading: false });
        }
    },

    addExpense: async (amount, category, note) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/expenses', { amount, category, note });
            set((state) => ({ expenses: [response.data, ...state.expenses] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add expense' });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteExpense: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/expenses/${id}`);
            set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete expense' });
        } finally {
            set({ isLoading: false });
        }
    },

    getDailyTotal: () => {
        const { expenses } = get();
        // Filter for today using local time
        const today = new Date().toISOString().split('T')[0];
        return expenses
            .filter(e => e.created_at.startsWith(today))
            .reduce((sum, e) => sum + e.amount, 0);
    },

    getCategoryBreakdown: () => {
        const { expenses } = get();
        const breakdown: Record<string, number> = {};
        expenses.forEach(e => {
            breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
        });
        return breakdown;
    }
}));
