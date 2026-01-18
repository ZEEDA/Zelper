import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface InsightCardProps {
    title: string;
    value: string | number;
    trend?: number; // percentage change, positive or negative
    trendLabel?: string; // e.g., "vs last week"
    icon?: React.ReactNode;
    color?: string; // background color for icon
}

export default function InsightCard({ title, value, trend, trendLabel, icon, color = 'bg-blue-100 text-blue-600' }: InsightCardProps) {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;
    const isNeutral = !trend || trend === 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
                {icon && (
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {trend !== undefined && (
                    <div className={`flex items-center text-xs font-bold mb-1 px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' :
                            isNegative ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                        }`}>
                        {isPositive && <ArrowUpRight size={14} className="mr-0.5" />}
                        {isNegative && <ArrowDownRight size={14} className="mr-0.5" />}
                        {isNeutral && <Minus size={14} className="mr-0.5" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            {trendLabel && <p className="text-xs text-gray-400 mt-2">{trendLabel}</p>}
        </div>
    );
}
