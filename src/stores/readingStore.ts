import { create } from 'zustand';
import api from '../utils/api';

export interface Book {
    id: number;
    user_id: number;
    title: string;
    type: 'paper' | 'pdf';
    total_pages: number;
    current_page: number;
    last_read_at?: string | null;
    created_at: string;
}

export interface ReadingSession {
    bookId: number;
    startTime: number;
    startPage: number;
}

interface ReadingState {
    books: Book[];
    currentReadingSession: ReadingSession | null;
    isLoading: boolean;
    error: string | null;

    fetchBooks: () => Promise<void>;
    addBook: (title: string, type: 'paper' | 'pdf', totalPages: number, currentPage?: number) => Promise<void>;
    updateProgress: (id: number, currentPage: number) => Promise<void>;
    deleteBook: (id: number) => Promise<void>;
    startSession: (bookId: number) => void;
    endSession: (endPage: number) => Promise<void>;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
    books: [],
    currentReadingSession: null,
    isLoading: false,
    error: null,

    fetchBooks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/books');
            set({ books: response.data.books });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch books' });
        } finally {
            set({ isLoading: false });
        }
    },

    addBook: async (title, type, totalPages, currentPage = 0) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/books', {
                title,
                type,
                totalPages,
                currentPage
            });
            set((state) => ({ books: [response.data.book, ...state.books] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add book' });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProgress: async (id, currentPage) => {
        // Optimistic update
        set((state) => ({
            books: state.books.map(b => b.id === id ? { ...b, current_page: currentPage, last_read_at: new Date().toISOString() } : b)
        }));

        try {
            await api.put(`/books/${id}`, { currentPage });
        } catch (error: any) {
            set({ error: error.message || 'Failed to update progress' });
            // revert? For simplicity, we assume success or refetch
            get().fetchBooks();
        }
    },

    deleteBook: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/books/${id}`);
            set((state) => ({ books: state.books.filter(b => b.id !== id) }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete book' });
        } finally {
            set({ isLoading: false });
        }
    },

    startSession: (bookId) => {
        const book = get().books.find(b => b.id === bookId);
        if (!book) return;

        set({
            currentReadingSession: {
                bookId,
                startTime: Date.now(),
                startPage: book.current_page
            }
        });
    },

    endSession: async (endPage) => {
        const { currentReadingSession } = get();
        if (!currentReadingSession) return;

        set({ isLoading: true, error: null });
        try {
            const durationMinutes = Math.round((Date.now() - currentReadingSession.startTime) / 60000);

            // Log session and update progress
            // Endpoints: POST /api/books/:id/session AND PUT /api/books/:id (implied or explicit?)
            // Usually session logging might update book progress too, but let's be explicit

            await api.post(`/books/${currentReadingSession.bookId}/session`, {
                startPage: currentReadingSession.startPage,
                endPage,
                durationMinutes
            });

            // Also update the book progress if changed
            if (endPage !== currentReadingSession.startPage) {
                await get().updateProgress(currentReadingSession.bookId, endPage);
            }

            set({ currentReadingSession: null });
        } catch (error: any) {
            set({ error: error.message || 'Failed to save reading session' });
        } finally {
            set({ isLoading: false });
        }
    }
}));
