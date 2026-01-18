import Button from '../common/Button';
import { Book } from '../../stores/readingStore';

interface ResumeModalProps {
    book: Book;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ResumeModal({ book, onConfirm, onCancel }: ResumeModalProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-inner">
                    <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Resume Reading?</h3>
                <p className="text-gray-600 font-medium">{book.title}</p>
                <p className="text-sm text-gray-500 mt-2">
                    You're on page <span className="font-bold text-gray-900">{book.current_page}</span> of {book.total_pages}
                </p>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onCancel} fullWidth>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm} fullWidth>
                    Start Session
                </Button>
            </div>
        </div>
    );
}
