import { Flame } from 'lucide-react';

interface StreakDisplayProps {
    days: number;
}

export default function StreakDisplay({ days }: StreakDisplayProps) {
    return (
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between overflow-hidden relative">
            {/* Background decorative flame */}
            <Flame className="absolute -right-6 -bottom-6 text-white text-opacity-20" size={120} />

            <div>
                <div className="text-sm font-medium text-orange-100 uppercase tracking-wide mb-1">Current Streak</div>
                <div className="text-5xl font-bold flex items-baseline gap-2">
                    {days}
                    <span className="text-lg font-medium text-orange-100">days</span>
                </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full shadow-inner border border-white/30">
                <Flame size={40} className="text-white fill-current animate-pulse-slow" />
            </div>
        </div>
    );
}
