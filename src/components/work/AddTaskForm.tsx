import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Plus } from 'lucide-react';
import { useTasksStore } from '../../stores/tasksStore';
import { useWorkStore } from '../../stores/workStore';

interface AddTaskFormProps {
    onTaskAdded?: () => void;
}

export default function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
    const { addTask, isLoading } = useTasksStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskEstimate, setNewTaskEstimate] = useState('');
    const currentSession = useWorkStore((state) => state.currentSession);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask(newTaskTitle, newTaskEstimate ? parseInt(newTaskEstimate) : undefined, currentSession?.id);
        setNewTaskTitle('');
        setNewTaskEstimate('');

        if (onTaskAdded) {
            onTaskAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Task Title"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                autoFocus
            />
            <Input
                type="number"
                label="Estimated Minutes"
                placeholder="e.g. 30"
                value={newTaskEstimate}
                onChange={(e) => setNewTaskEstimate(e.target.value)}
            />
            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    size="md"
                    icon={<Plus size={20} />}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                    Add Task
                </Button>
            </div>
        </form>
    );
}
