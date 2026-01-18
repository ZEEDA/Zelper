import { useExpensesStore } from '../../stores/expensesStore';
import { CATEGORIES } from './CategorySelector';
import { Trash2 } from 'lucide-react';

export default function ExpenseTimeline() {
    const { expenses, deleteExpense } = useExpensesStore();

    // Sort by date desc
    const sortedExpenses = [...expenses].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (sortedExpenses.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 text-sm">
                No expenses yet today.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedExpenses.map(expense => {
                const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[CATEGORIES.length - 1];

                return (
                    <div key={expense.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 group">
                        <div className={`p-3 rounded-full flex-shrink-0 ${category.color}`}>
                            {category.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 truncate">{category.label}</h4>
                                <span className="font-bold text-gray-900">-${expense.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500 truncate">{expense.note || 'No note'}</p>
                                <span className="text-xs text-gray-400">
                                    {new Date(expense.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteExpense(expense.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
