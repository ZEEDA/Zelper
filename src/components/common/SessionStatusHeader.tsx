import { useWorkStore } from '../../stores/workStore';
import { useReadingStore } from '../../stores/readingStore';
import LiveTimer from '../work/LiveTimer';
import { useAuthStore } from '../../stores/authStore';
import { LogOut } from 'lucide-react';

export default function SessionStatusHeader() {
    const status = useWorkStore((state) => state.status);
    const readingSession = useReadingStore((state) => state.currentReadingSession);
    const { logout } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="w-1/3">
                {/* Left side spacer or breadcrumbs if needed later */}
            </div>

            <div className="w-1/3 flex justify-center">
                {status !== 'checked_out' ? (
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <div className={`w-2 h-2 rounded-full ${status === 'on_break' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
                        <span className="text-sm font-medium text-gray-600">
                            {status === 'on_break' ? 'On Break' : 'Focusing'}
                        </span>
                        <div className="h-4 w-px bg-gray-300 mx-2" />
                        <div className="scale-75 origin-left">
                            <LiveTimer size="small" />
                        </div>
                    </div>
                ) : readingSession ? (
                    <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-medium text-blue-600">
                            Reading
                        </span>
                        <div className="h-4 w-px bg-blue-200 mx-2" />
                        <div className="scale-75 origin-left">
                            <LiveTimer size="small" mode="reading" />
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="w-1/3 flex justify-end">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
}
