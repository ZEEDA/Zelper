import { useState, useEffect } from 'react';
import { useTasksStore, Task } from '../stores/tasksStore';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import AddTaskForm from '../components/work/AddTaskForm';
import { Plus, Trash2, Check, ExternalLink, Play, Pause } from 'lucide-react';
import { formatDate, formatDuration } from '../utils/dateTime';

export default function TasksPage() {
    const { tasks, fetchTasks, toggleComplete, deleteTask, startTimer, stopTimer, activeTaskId, isLoading } = useTasksStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Handle initial loading
    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Sort tasks
    const sortedTasks = [...tasks].sort((a, b) => {
        // Active first
        if (activeTaskId === a.id) return -1;
        if (activeTaskId === b.id) return 1;

        // Incomplete first
        if (a.completed === b.completed) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
        }
        return a.completed ? 1 : -1;
    });

    return (
        <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-500 mt-1">Manage all your tasks in one place.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    icon={<Plus size={20} />}
                    size="lg"
                >
                    Add Task
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 w-12"></th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date Added</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Estimate</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Actual</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No tasks found. Create one to get started!
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map((task) => (
                                    <tr key={task.id} className={`group hover:bg-gray-50 transition-colors ${task.completed ? 'bg-gray-50/50' : ''} ${activeTaskId === task.id ? 'bg-primary/5' : ''}`}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleComplete(task.id, !task.completed)}
                                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500 text-transparent'
                                                    }`}
                                            >
                                                <Check size={12} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                {task.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {formatDate(task.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {task.estimatedMinutes ? formatDuration(task.estimatedMinutes) : '-'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${activeTaskId === task.id ? 'text-primary font-bold' : 'text-gray-500'}`}>
                                            {formatDuration(task.actualMinutes)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.completed ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!task.completed && (
                                                    <button
                                                        onClick={() => activeTaskId === task.id ? stopTimer(task.id) : startTimer(task.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${activeTaskId === task.id
                                                            ? 'bg-primary text-white hover:bg-primary-dark'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                                            }`}
                                                        title={activeTaskId === task.id ? "Stop Timer" : "Start Timer"}
                                                    >
                                                        {activeTaskId === task.id ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Task"
            >
                <AddTaskForm onTaskAdded={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
}
