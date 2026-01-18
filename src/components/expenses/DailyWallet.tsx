import { useExpensesStore } from '../../stores/expensesStore';
import { formatDuration } from '../../utils/dateTime'; // Wait, need currency formatter

export default function DailyWallet() {
    const { getDailyTotal, dailyBudget } = useExpensesStore();
    const total = getDailyTotal();

    // Default budget if not set
    const budget = dailyBudget || 50;
    const percentage = Math.min(100, (total / budget) * 100);

    const statusColor = percentage < 75 ? 'bg-green-500' : percentage < 90 ? 'bg-yellow-500' : 'bg-red-500';
    const textColor = percentage < 75 ? 'text-green-600' : percentage < 90 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Today's Wallet</h2>

            <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">${total.toFixed(2)}</span>
                <span className="text-gray-400 mb-1 font-medium">/ ${budget}</span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase">
                    <span>Budget Used</span>
                    <span className={textColor}>{Math.round(percentage)}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${statusColor} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
