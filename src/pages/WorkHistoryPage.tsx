import { useEffect } from 'react';
import { useWorkStore } from '../stores/workStore';
import { formatDuration, formatTime, formatDate } from '../utils/dateTime';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkHistoryPage() {
    const fetchHistorySessions = useWorkStore((state) => state.fetchHistorySessions);
    const historySessions = useWorkStore((state) => state.historySessions);
    const isLoading = useWorkStore((state) => state.isLoading);

    useEffect(() => {
        fetchHistorySessions();
    }, [fetchHistorySessions]);
    console.log('HISTORY SESSIONS: ', historySessions);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Work History</h1>
                    <p className="text-gray-500">View your past work sessions.</p>
                </div>
                <Link
                    to="/work/today"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Go to Today <ArrowRight size={18} />
                </Link>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {historySessions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No work history found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Check In</th>
                                        <th className="px-6 py-4">Check Out</th>
                                        <th className="px-6 py-4">Work Duration</th>
                                        <th className="px-6 py-4">Break Duration</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {historySessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {formatDate(session.checkInTime)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatTime(session.checkInTime)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {session.checkOutTime ? formatTime(session.checkOutTime) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDuration(session.totalWorkMinutes)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDuration(session.totalBreakMinutes)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.status === 'checked_in'
                                                        ? 'bg-green-100 text-green-800'
                                                        : session.status === 'on_break'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {session.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
