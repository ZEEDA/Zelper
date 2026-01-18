import { Book } from '../../stores/readingStore';
import ReadingProgress from './ReadingProgress';
import Button from '../common/Button';
import { BookOpen, FileText, Play } from 'lucide-react';

interface BookCardProps {
    book: Book;
    onResume: (book: Book) => void;
}

export default function BookCard({ book, onResume }: BookCardProps) {
    const percentage = Math.min(100, (book.current_page / book.total_pages) * 100);

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-16 rounded-lg flex items-center justify-center ${book.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    {book.type === 'pdf' ? <FileText size={24} /> : <BookOpen size={24} />}
                </div>
                <ReadingProgress percentage={percentage} size={48} strokeWidth={3} />
            </div>

            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 flex-1" title={book.title}>
                {book.title}
            </h3>

            <p className="text-xs text-gray-500 mb-4">
                Page {book.current_page} of {book.total_pages}
            </p>

            <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onResume(book)}
                icon={<Play size={16} />}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
                Resume
            </Button>
        </div>
    );
}
