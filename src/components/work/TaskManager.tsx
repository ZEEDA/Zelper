import { useState } from 'react';
import { useTasksStore } from '../../stores/tasksStore';
import Button from '../common/Button';
import Input from '../common/Input';
import { Play, Pause, Check, Trash2, Plus } from 'lucide-react';
import { formatDuration } from '../../utils/dateTime';

export default function TaskManager() {
    const { tasks, addTask, toggleComplete, startTimer, stopTimer, deleteTask, activeTaskId, isLoading } = useTasksStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskEstimate, setNewTaskEstimate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask(newTaskTitle, newTaskEstimate ? parseInt(newTaskEstimate) : undefined);
        setNewTaskTitle('');
        setNewTaskEstimate('');
    };

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
            <h3 className="text-lg font-bold text-gray-900">Tasks</h3>

            <form onSubmit={handleSubmit} className="flex gap-2 items-start">
                <Input
                    placeholder="What are you working on?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1"
                />
                <Input
                    type="number"
                    placeholder="Min"
                    className="w-20"
                    value={newTaskEstimate}
                    onChange={(e) => setNewTaskEstimate(e.target.value)}
                />
                <Button type="submit" size="md" icon={<Plus size={20} />} disabled={isLoading}>
                    Add
                </Button>
            </form>

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
                                    {task.estimated_minutes && <span>Est: {formatDuration(task.estimated_minutes)}</span>}
                                    {task.actual_minutes > 0 && (
                                        <span className={activeTaskId === task.id ? 'text-primary font-bold' : ''}>
                                            Actual: {formatDuration(task.actual_minutes)}
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
