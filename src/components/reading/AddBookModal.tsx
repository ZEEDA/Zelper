import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useReadingStore } from '../../stores/readingStore';
import { BookOpen, FileText } from 'lucide-react';

interface AddBookModalProps {
    onClose: () => void;
}

export default function AddBookModal({ onClose }: AddBookModalProps) {
    const { addBook, isLoading } = useReadingStore();
    const [title, setTitle] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const [type, setType] = useState<'paper' | 'pdf'>('paper');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !totalPages) return;

        await addBook(
            title,
            type,
            parseInt(totalPages),
            currentPage ? parseInt(currentPage) : 0
        );
        onClose();
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                <button
                    type="button"
                    onClick={() => setType('paper')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${type === 'paper' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen size={18} />
                    Paper Book
                </button>
                <button
                    type="button"
                    onClick={() => setType('pdf')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${type === 'pdf' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText size={18} />
                    PDF Document
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="Book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Total Pages"
                        type="number"
                        placeholder="e.g. 350"
                        value={totalPages}
                        onChange={(e) => setTotalPages(e.target.value)}
                        required
                    />
                    <Input
                        label="Current Page"
                        type="number"
                        placeholder="e.g. 0"
                        value={currentPage}
                        onChange={(e) => setCurrentPage(e.target.value)}
                    />
                </div>

                {type === 'pdf' && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                        Note: For PDFs, you'll need to select the file from your device when you start reading. We only store the progress.
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Add to Library
                    </Button>
                </div>
            </form>
        </div>
    );
}
