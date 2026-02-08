import { useState } from 'react';
import { useTasksStore } from '../../stores/tasksStore';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Play, Pause, Check, Trash2, Plus } from 'lucide-react';
import { formatDuration } from '../../utils/dateTime';
import AddTaskForm from './AddTaskForm';

export default function TaskManager() {
    const { tasks, toggleComplete, startTimer, stopTimer, deleteTask, activeTaskId } = useTasksStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    console.log('Tasks:', tasks);

    // Sort: Active first, then incomplete, then completed
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
            if (activeTaskId === a.id) return -1;
            if (activeTaskId === b.id) return 1;
            return 0; // Maintain order or sort by date
        }
        return a.completed ? 1 : -1;
    });

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Tasks</h3>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    icon={<Plus size={16} />}
                    size="sm"
                >
                    Add Task
                </Button>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Task"
            >
                <AddTaskForm onTaskAdded={() => setIsAddModalOpen(false)} />
            </Modal>

            <div className="space-y-2">
                {sortedTasks.map(task => (
                    <div
                        key={task.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${task.completed ? 'bg-gray-50 border-gray-100 opacity-60' :
                            activeTaskId === task.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <button
                                onClick={() => toggleComplete(task.id, !task.completed)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-500 text-transparent'
                                    }`}
                            >
                                <Check size={14} />
                            </button>
                            <div className="flex flex-col min-w-0">
                                <span className={`font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {task.estimatedMinutes && (
                                        <span>{formatDuration(task.estimatedMinutes)}</span>
                                    )}
                                    {task.actualMinutes > 0 && (
                                        <span className={activeTaskId === task.id ? 'text-primary font-bold' : ''}>
                                            Actual: {formatDuration(task.actualMinutes)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!task.completed && (
                                <button
                                    onClick={() => activeTaskId === task.id ? stopTimer(task.id) : startTimer(task.id)}
                                    className={`p-2 rounded-lg transition-colors ${activeTaskId === task.id
                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                        }`}
                                >
                                    {activeTaskId === task.id ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                            )}
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                        No tasks yet. Add one above!
                    </div>
                )}
            </div>
        </div>
    );
}
