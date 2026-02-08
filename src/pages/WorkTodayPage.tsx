import { useEffect, useState, useRef } from 'react';
import CheckInButton from '../components/work/CheckInButton';
import DailyTimeline from '../components/work/DailyTimeline';
import TaskManager from '../components/work/TaskManager';
import DaySummary from '../components/work/DaySummary';
import Modal from '../components/common/Modal';
import { useWorkStore } from '../stores/workStore';
import { useTasksStore } from '../stores/tasksStore';

export default function WorkTodayPage() {
    const fetchTodaySession = useWorkStore((state) => state.fetchTodaySession);
    const checkOut = useWorkStore((state) => state.checkOut);
    const status = useWorkStore((state) => state.status);
    const fetchTasks = useTasksStore((state) => state.fetchTasks);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    useEffect(() => {
        fetchTodaySession();
        fetchTasks();

        return () => {
        };
    }, [fetchTodaySession, fetchTasks]);

    const handleCheckOutClick = () => {
        setIsSummaryOpen(true);
    };

    const handleConfirmCheckOut = async () => {
        await checkOut();
        setIsSummaryOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Work & Focus</h1>
                <p className="text-gray-500">Track your time and manage tasks.</p>
            </header>

            <section>
                <CheckInButton onCheckOut={handleCheckOutClick} />
            </section>

            {status !== 'checked_out' && (
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
                            <p className="text-sm text-gray-500">Your activity today</p>
                        </div>
                        <DailyTimeline />
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Task Manager</h2>
                            <p className="text-sm text-gray-500">Stay focused on priorities</p>
                        </div>
                        <TaskManager />
                    </section>
                </div>
            )}

            <Modal
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                title="End of Day Summary"
            >
                <DaySummary
                    onConfirm={handleConfirmCheckOut}
                    onCancel={() => setIsSummaryOpen(false)}
                />
            </Modal>
        </div>
    );
}
