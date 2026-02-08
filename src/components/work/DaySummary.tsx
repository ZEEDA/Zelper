import { formatDuration } from '../../utils/dateTime';
import { useWorkStore } from '../../stores/workStore';
import { useTasksStore } from '../../stores/tasksStore';
import Button from '../common/Button';

interface DaySummaryProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DaySummary({ onConfirm, onCancel }: DaySummaryProps) {
    const { currentSession } = useWorkStore();
    const { tasks } = useTasksStore();

    if (!currentSession) return null;

    // Calculate session stats
    const workTime = currentSession.totalWorkMinutes; // Assuming this is updated from backend
    // Or calculate locally if backend hasn't updated yet? 
    // Usually on check-out confirmation we show what *will* be logged or current state.
    // Let's use currentSession data.

    // Count completed tasks today
    const completedTasks = tasks.filter(t => t.completed).length; // Filter by 'today' if we stored task completion time?
    const totalTasks = tasks.length;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="text-6xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-gray-900">Great job today!</h3>
                <p className="text-gray-500">Here's your summary for this session.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-primary">{formatDuration(workTime)}</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Focus Time</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-secondary">{completedTasks}/{totalTasks}</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Tasks Done</div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Break Time</span>
                    <span className="font-medium">{formatDuration(currentSession.totalBreakMinutes)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Session Start</span>
                    <span className="font-medium">{new Date(currentSession.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onCancel} fullWidth>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm} fullWidth>
                    Confirm Check Out
                </Button>
            </div>
        </div>
    );
}
