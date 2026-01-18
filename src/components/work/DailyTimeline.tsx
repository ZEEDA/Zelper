import { useWorkStore } from '../../stores/workStore';
import { formatTime } from '../../utils/dateTime';
import { CheckCircle, Clock, Coffee, LogOut } from 'lucide-react';

export default function DailyTimeline() {
    const { currentSession } = useWorkStore();

    if (!currentSession) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm">
                No activity yet today. Check in to start your timeline.
            </div>
        );
    }

    // Transform session data into events
    // Assuming backend returns a timeline array or we derive it
    // For MVP, we derive from check-in/out/breaks
    // Since we don't have a full event log in the store type yet (only summaries),
    // We visualize what we have: Check In time.

    // Future: Parse `timeline_json` from session if available.
    // For now, static representation of start time.

    return (
        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 my-6">
            <div className="relative">
                <div className="absolute -left-[21px] bg-green-100 p-1 rounded-full border-2 border-white">
                    <Clock size={16} className="text-green-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {formatTime(currentSession.check_in_time)}
                    </span>
                    <span className="font-medium text-gray-900">Checked In</span>
                </div>
            </div>

            {/* If we had break logs, map them here */}
            {currentSession.total_break_minutes > 0 && (
                <div className="relative">
                    <div className="absolute -left-[21px] bg-yellow-100 p-1 rounded-full border-2 border-white">
                        <Coffee size={16} className="text-yellow-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {currentSession.total_break_minutes}m
                        </span>
                        <span className="font-medium text-gray-900">Break Time Taken</span>
                    </div>
                </div>
            )}

            {currentSession.check_out_time && (
                <div className="relative">
                    <div className="absolute -left-[21px] bg-gray-100 p-1 rounded-full border-2 border-white">
                        <LogOut size={16} className="text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {formatTime(currentSession.check_out_time)}
                        </span>
                        <span className="font-medium text-gray-900">Checked Out</span>
                    </div>
                </div>
            )}

            {!currentSession.check_out_time && (
                <div className="relative">
                    <div className="absolute -left-[9px] w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
                    <div className="ml-2 text-primary text-sm font-medium">Currently Working</div>
                </div>
            )}
        </div>
    );
}
