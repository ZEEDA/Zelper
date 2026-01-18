import { useState } from 'react';
import { useExpensesStore } from '../../stores/expensesStore';
import CategorySelector from './CategorySelector';
import Button from '../common/Button';
import Input from '../common/Input';
import { DollarSign } from 'lucide-react';

interface QuickAddExpenseProps {
    onClose: () => void;
}

export default function QuickAddExpense({ onClose }: QuickAddExpenseProps) {
    const { addExpense, isLoading } = useExpensesStore();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [note, setNote] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        await addExpense(parseFloat(amount), category, note);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-center text-5xl font-bold py-6 bg-transparent border-none focus:outline-none placeholder-gray-200 text-gray-900"
                    autoFocus
                    required
                    step="0.01"
                    min="0.01"
                />
                <DollarSign className="absolute top-1/2 left-8 -translate-y-1/2 text-gray-300 pointer-events-none" size={32} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Category</label>
                <CategorySelector selectedCategory={category} onSelect={setCategory} />
            </div>

            <Input
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <div className="pt-2">
                <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                    Add Expense
                </Button>
            </div>
        </form>
    );
}
