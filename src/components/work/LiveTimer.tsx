import { useEffect, useState } from 'react';
import { useWorkStore } from '../../stores/workStore';
import { useReadingStore } from '../../stores/readingStore';
import { formatTimer } from '../../utils/dateTime';

interface LiveTimerProps {
    size?: 'small' | 'large';
    mode?: 'work' | 'reading'; // Force a specific mode if needed
}

export default function LiveTimer({ size, mode }: LiveTimerProps) {
    const currentWorkSession = useWorkStore((state) => state.currentSession);
    const workStatus = useWorkStore((state) => state.status);

    const currentReadingSession = useReadingStore((state) => state.currentReadingSession);

    // Determine effective mode if not specified
    const effectiveMode = mode || (currentWorkSession && workStatus !== 'checked_out' ? 'work' : 'reading');

    // Determine active session based on mode
    const isActive = effectiveMode === 'work'
        ? (workStatus !== 'checked_out' && !!currentWorkSession)
        : !!currentReadingSession;

    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            if (effectiveMode === 'work') {
                if (workStatus === 'checked_out' || !currentWorkSession) {
                    setElapsed(0);
                    return;
                }

                if (workStatus === 'on_break' && currentWorkSession.lastBreakStartTime) {
                    const startTime = new Date(currentWorkSession.checkInTime).getTime();
                    const breakStartTime = new Date(currentWorkSession.lastBreakStartTime).getTime();
                    const totalBreakMs = (currentWorkSession.totalBreakMinutes || 0) * 60000;
                    setElapsed(Math.max(0, (breakStartTime - startTime - totalBreakMs) / 60000));
                } else {
                    const startTime = new Date(currentWorkSession.checkInTime).getTime();
                    const now = Date.now();
                    const totalBreakMs = (currentWorkSession.totalBreakMinutes || 0) * 60000;
                    setElapsed(Math.max(0, (now - startTime - totalBreakMs) / 60000));
                }
            } else {
                // Reading mode
                if (!currentReadingSession) {
                    setElapsed(0);
                    return;
                }
                const diff = Date.now() - currentReadingSession.startTime;
                setElapsed(Math.max(0, diff / 60000));
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [currentWorkSession, workStatus, currentReadingSession, effectiveMode]);

    if (!isActive) return null;

    const getColorClass = () => {
        if (effectiveMode === 'reading') return 'text-blue-600';
        return workStatus === 'on_break' ? 'text-yellow-600' : 'text-primary';
    };

    if (size === 'small') {
        return (
            <div className={`font-mono font-bold tracking-tight text-xl ${getColorClass()}`}>
                {formatTimer(elapsed)}
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className={`text-4xl font-bold font-mono tracking-tight ${getColorClass()}`}>
                {formatTimer(elapsed)}
            </div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                {effectiveMode === 'reading' ? 'Reading Time' : (workStatus === 'on_break' ? 'On Break' : 'Focus Time')}
            </div>
        </div>
    );
}
