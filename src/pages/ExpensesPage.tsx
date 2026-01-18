import { useEffect, useState } from 'react';
import { useExpensesStore } from '../stores/expensesStore';
import DailyWallet from '../components/expenses/DailyWallet';
import ExpenseTimeline from '../components/expenses/ExpenseTimeline';
import QuickAddExpense from '../components/expenses/QuickAddExpense';
import Modal from '../components/common/Modal';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { Plus } from 'lucide-react';

export default function ExpensesPage() {
    const { fetchExpenses } = useExpensesStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return (
        <div className="max-w-md mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                <p className="text-gray-500">Track your daily spending.</p>
            </header>

            <section>
                <DailyWallet />
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                <ExpenseTimeline />
            </section>

            <FloatingActionButton
                actions={[
                    {
                        label: 'Add Expense',
                        icon: <Plus size={24} />,
                        onClick: () => setIsAddModalOpen(true)
                    }
                ]}
            />

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Expense"
            >
                <QuickAddExpense onClose={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
}
