import { useWorkStore } from '../stores/workStore';
import { useTasksStore } from '../stores/tasksStore';
import { useReadingStore } from '../stores/readingStore';
import { useExpensesStore } from '../stores/expensesStore';
import { useSyncStore } from '../stores/syncStore';

export const syncManager = {
    syncAll: async () => {
        const syncStore = useSyncStore.getState();

        // Don't trigger if already syncing or offline
        if (syncStore.status === 'syncing' || !syncStore.isOnline) return;

        syncStore.setStatus('syncing');

        try {
            await Promise.all([
                useWorkStore.getState().fetchTodaySession(),
                useTasksStore.getState().fetchTasks(),
                useReadingStore.getState().fetchBooks(),
                useExpensesStore.getState().fetchExpenses()
            ]);

            syncStore.setLastSyncTime(Date.now());
            syncStore.setStatus('synced');
        } catch (error) {
            console.error('Sync failed:', error);
            syncStore.setStatus('failed');
        }
    },

    // Future expansion: processOfflineQueue()
};
