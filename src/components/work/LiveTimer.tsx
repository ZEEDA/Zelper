import { useEffect, useState } from 'react';
import { useWorkStore } from '../../stores/workStore';
import { formatDuration } from '../../utils/dateTime';

export default function LiveTimer() {
    const { currentSession, status } = useWorkStore();
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (status === 'checked_out' || !currentSession) {
            setElapsed(0);
            return;
        }

        const updateTimer = () => {
            // Basic calculation: now - checkInTime - breakTime
            // For simplicity, we'll just track raw time difference from check-in for now
            // Or rely on store to provide `timerStartTime`.
            // If status is 'on_break', timer should pause visually or show break time?
            // Let's assume we show "Work Time" or "Break Time" depending on status.

            const startTime = new Date(currentSession.check_in_time).getTime();
            // We need to account for breaks. `total_break_minutes` is in the session object.

            const now = Date.now();
            const totalBreakMs = (currentSession.total_break_minutes || 0) * 60000;
            const diff = now - startTime - totalBreakMs;

            setElapsed(Math.max(0, Math.floor(diff / 60000))); // minutes
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000); // Update every second (even if we just show mins)
        return () => clearInterval(interval);
    }, [currentSession, status]);

    if (status === 'checked_out') return null;

    return (
        <div className="text-center">
            <div className={`text-4xl font-bold font-mono tracking-tight ${status === 'on_break' ? 'text-yellow-600' : 'text-primary'}`}>
                {formatDuration(elapsed)}
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                {status === 'on_break' ? 'On Break' : 'Focus Time'}
            </div>
        </div>
    );
}
