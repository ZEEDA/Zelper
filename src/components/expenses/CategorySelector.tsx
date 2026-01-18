import { Utensils, Car, ShoppingBag, Receipt, Gamepad2, HeartPulse, GraduationCap, MoreHorizontal } from 'lucide-react';

interface CategorySelectorProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export const CATEGORIES = [
    { id: 'Food', label: 'Food', icon: <Utensils size={24} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'Transport', label: 'Transport', icon: <Car size={24} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={24} />, color: 'bg-pink-100 text-pink-600' },
    { id: 'Bills', label: 'Bills', icon: <Receipt size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'Entertainment', label: 'Fun', icon: <Gamepad2 size={24} />, color: 'bg-purple-100 text-purple-600' },
    { id: 'Health', label: 'Health', icon: <HeartPulse size={24} />, color: 'bg-red-100 text-red-600' },
    { id: 'Education', label: 'Education', icon: <GraduationCap size={24} />, color: 'bg-green-100 text-green-600' },
    { id: 'Other', label: 'Other', icon: <MoreHorizontal size={24} />, color: 'bg-gray-100 text-gray-600' },
];

export default function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelect(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 ${selectedCategory === cat.id
                            ? 'border-primary bg-primary/5 scale-105 shadow-sm'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                >
                    <div className={`p-2 rounded-full mb-1 ${cat.color} ${selectedCategory === cat.id ? 'ring-2 ring-offset-1 ring-primary/20' : ''}`}>
                        {cat.icon}
                    </div>
                    <span className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-primary font-bold' : 'text-gray-600'}`}>
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
