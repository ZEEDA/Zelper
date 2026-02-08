import { useEffect } from 'react';
import CircularProgress from '../components/common/CircularProgress';
import WeeklyHeatmap from '../components/insights/WeeklyHeatmap';
import InsightCard from '../components/insights/InsightCard';
import StreakDisplay from '../components/insights/StreakDisplay';
import { useWorkStore } from '../stores/workStore';
import { useExpensesStore } from '../stores/expensesStore';
import { useTasksStore } from '../stores/tasksStore';
import { Clock, CheckSquare, DollarSign } from 'lucide-react';
import { formatDuration } from '../utils/dateTime';

export default function InsightsPage() {
    const { fetchTodaySession, currentSession } = useWorkStore();
    const { fetchExpenses, getDailyTotal } = useExpensesStore();
    const { fetchTasks, tasks } = useTasksStore();

    useEffect(() => {
        fetchTodaySession();
        fetchExpenses();
        fetchTasks();
    }, [fetchTodaySession, fetchExpenses, fetchTasks]);

    // Derived stats (Current Day mainly)
    const workMinutes = currentSession?.totalWorkMinutes || 0;
    const expenseTotal = getDailyTotal();
    const completedTasks = tasks.filter(t => t.completed).length;

    // Mock historical data for visualization until backend supports history API
    const weeklyActivity = [4, 6, 2, 8, 5, 0, workMinutes ? Math.min(10, workMinutes / 30) : 0]; // Last one is today projected

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
                <p className="text-gray-500">Overview of your productivity and habits.</p>
            </header>

            <section className="grid md:grid-cols-2 gap-6">
                <StreakDisplay days={12} /> {/* Mock streak for now */}
                <WeeklyHeatmap data={weeklyActivity} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard
                    title="Work Today"
                    value={formatDuration(workMinutes)}
                    trend={15}
                    trendLabel="vs yesterday"
                    icon={<Clock size={20} />}
                    color="bg-blue-100 text-blue-600"
                />
                <InsightCard
                    title="Expenses"
                    value={`$${expenseTotal.toFixed(2)}`}
                    trend={-5}
                    trendLabel="vs avg daily"
                    icon={<DollarSign size={20} />}
                    color="bg-green-100 text-green-600"
                />
                <InsightCard
                    title="Tasks Done"
                    value={completedTasks}
                    trend={25}
                    trendLabel="vs last week"
                    icon={<CheckSquare size={20} />}
                    color="bg-purple-100 text-purple-600"
                />
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-900 mb-8">Daily Goal Progress</h3>
                <div className="flex flex-wrap justify-center gap-12">
                    <CircularProgress
                        value={(workMinutes / 360) * 100} // Goal 6h
                        label={`${Math.round((workMinutes / 60) * 10) / 10}h`}
                        subLabel="Work"
                        color="text-blue-500"
                    />
                    <CircularProgress
                        value={(completedTasks / 5) * 100} // Goal 5 tasks
                        label={`${completedTasks}`}
                        subLabel="Tasks"
                        color="text-purple-500"
                    />
                    <CircularProgress
                        value={Math.min(100, (expenseTotal / 50) * 100)}
                        label={`$${expenseTotal}`}
                        subLabel="Budget"
                        color="text-green-500"
                    />
                </div>
            </section>
        </div>
    );
}
