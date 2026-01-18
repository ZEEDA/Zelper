import { useWorkStore } from '../../stores/workStore';
import Button from '../common/Button';
import { Play, Pause, Square } from 'lucide-react';
import LiveTimer from './LiveTimer';

interface CheckInButtonProps {
    onCheckOut?: () => void; // Callback to open summary modal
}

export default function CheckInButton({ onCheckOut }: CheckInButtonProps) {
    const { status, checkIn, startBreak, endBreak, isLoading } = useWorkStore();

    if (status === 'checked_out') {
        return (
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={() => checkIn()}
                    disabled={isLoading}
                    className="group relative flex items-center justify-center w-32 h-32 rounded-full bg-primary text-white shadow-xl transition-all hover:scale-105 hover:bg-primary-dark focus:ring-4 focus:ring-primary/30"
                >
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse-slow"></div>
                    <div className="flex flex-col items-center gap-1">
                        <Play size={32} className="ml-1 fill-current" />
                        <span className="font-bold text-lg">Check In</span>
                    </div>
                </button>
                <p className="text-gray-500 font-medium">Ready to start?</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <LiveTimer />

            <div className="grid grid-cols-2 gap-3 w-full">
                {status === 'checked_in' ? (
                    <Button
                        variant="secondary"
                        onClick={() => startBreak()}
                        isLoading={isLoading}
                        icon={<Pause size={18} />}
                    >
                        Break
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => endBreak()}
                        isLoading={isLoading}
                        icon={<Play size={18} />}
                    >
                        Resume
                    </Button>
                )}

                <Button
                    variant="danger"
                    onClick={onCheckOut}
                    isLoading={isLoading}
                    icon={<Square size={18} />}
                >
                    Check Out
                </Button>
            </div>
        </div>
    );
}
