import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'synced' | 'syncing' | 'failed' | 'offline';

export interface SyncAction {
    type: string;
    payload: any;
    timestamp: number;
    retryCount: number;
}

interface SyncState {
    status: SyncStatus;
    lastSyncTime: number | null;
    offlineQueue: SyncAction[];
    isOnline: boolean;

    setStatus: (status: SyncStatus) => void;
    setLastSyncTime: (time: number) => void;
    addToQueue: (action: Omit<SyncAction, 'timestamp' | 'retryCount'>) => void;
    removeFromQueue: (timestamp: number) => void;
    clearQueue: () => void;
    setOnline: (isOnline: boolean) => void;
}

export const useSyncStore = create<SyncState>()(
    persist(
        (set) => ({
            status: 'synced',
            lastSyncTime: null,
            offlineQueue: [],
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

            setStatus: (status) => set({ status }),
            setLastSyncTime: (time) => set({ lastSyncTime: time }),
            addToQueue: (action) =>
                set((state) => ({
                    offlineQueue: [
                        ...state.offlineQueue,
                        { ...action, timestamp: Date.now(), retryCount: 0 },
                    ],
                })),
            removeFromQueue: (timestamp) =>
                set((state) => ({
                    offlineQueue: state.offlineQueue.filter((a) => a.timestamp !== timestamp),
                })),
            clearQueue: () => set({ offlineQueue: [] }),
            setOnline: (isOnline) => set({ isOnline }),
        }),
        {
            name: 'zelper-sync-storage',
            partialize: (state) => ({
                lastSyncTime: state.lastSyncTime,
                offlineQueue: state.offlineQueue,
            }),
        }
    )
);

// Listen for online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        useSyncStore.getState().setOnline(true);
        useSyncStore.getState().setStatus('synced'); // Optimistically set to synced, or trigger sync
    });
    window.addEventListener('offline', () => {
        useSyncStore.getState().setOnline(false);
        useSyncStore.getState().setStatus('offline');
    });
}
