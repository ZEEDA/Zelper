import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export interface FABAction {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string; // Tailwind color class e.g. 'bg-blue-500'
}

interface FloatingActionButtonProps {
    actions: FABAction[];
}

export default function FloatingActionButton({ actions }: FloatingActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
            <button
                onClick={toggleOpen}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-gray-100 text-gray-900 rotate-45' : 'bg-primary text-white hover:bg-primary-dark hover:scale-105'
                    }`}
            >
                {isOpen ? <Plus size={28} /> : <Plus size={28} />}
            </button>

            {isOpen && (
                <div className="flex flex-col-reverse items-end gap-3 mb-1">
                    {actions.map((action, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 animate-slide-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                                {action.label}
                            </span>
                            <button
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md text-white transition-transform hover:scale-110 ${action.color || 'bg-secondary'}`}
                            >
                                {action.icon}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
