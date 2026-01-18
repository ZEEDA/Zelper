import { useEffect, useState } from 'react';
import { useSyncStore } from '../../stores/syncStore';
import { syncManager } from '../../utils/syncManager';
import { formatRelativeTime } from '../../utils/dateTime';

export default function SyncIndicator() {
    const { status, lastSyncTime, isOnline } = useSyncStore();
    // Force re-render for relative time updates
    const [, setTick] = useState(0);

    // Update relative time every minute
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        if (status !== 'syncing' && isOnline) {
            syncManager.syncAll();
        }
    };

    const statusConfig = {
        synced: { icon: '🟢', text: 'Synced', color: 'text-green-600', border: 'border-green-100' },
        syncing: { icon: '🟡', text: 'Syncing...', color: 'text-yellow-600', border: 'border-yellow-100' },
        failed: { icon: '🔴', text: 'Sync Failed', color: 'text-red-600', border: 'border-red-100' },
        offline: { icon: '⚪', text: 'Offline', color: 'text-gray-500', border: 'border-gray-200' },
    };

    // If offline, override status unless we want to show 'failed' state persisting
    const displayStatus = !isOnline ? 'offline' : status;
    const config = statusConfig[displayStatus];

    return (
        <button
            onClick={handleClick}
            disabled={!isOnline || status === 'syncing'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border ${config.border} shadow-sm text-sm font-medium transition-all hover:bg-white hover:shadow-md disabled:cursor-default disabled:opacity-80`}
            title={lastSyncTime ? `Last synced: ${new Date(lastSyncTime).toLocaleString()}` : 'Not synced yet'}
        >
            <span className={`text-base leading-none ${status === 'syncing' ? 'animate-pulse' : ''}`}>
                {config.icon}
            </span>
            <span className={config.color}>{config.text}</span>
            {lastSyncTime && displayStatus === 'synced' && (
                <span className="text-xs text-gray-400 ml-1 border-l border-gray-200 pl-2 hidden sm:inline">
                    {formatRelativeTime(lastSyncTime)}
                </span>
            )}
        </button>
    );
}
