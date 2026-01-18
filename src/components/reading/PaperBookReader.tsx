import { useState } from 'react';
import { useReadingStore } from '../../stores/readingStore';
import Button from '../common/Button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import ReadingProgress from './ReadingProgress';

interface PaperBookReaderProps {
    bookId: number;
    startPage: number;
    totalPages: number;
    title: string;
}

export default function PaperBookReader({ bookId, startPage, totalPages, title }: PaperBookReaderProps) {
    const { endSession, updateProgress, isLoading } = useReadingStore();
    const [page, setPage] = useState(startPage);

    const handlePageChange = (newPage: number) => {
        const safePage = Math.max(0, Math.min(totalPages, newPage));
        setPage(safePage);
        // Optionally auto-save progress periodically? For now, we save on session end.
    };

    const handleFinish = async () => {
        await endSession(page);
    };

    const percentage = Math.min(100, (page / totalPages) * 100);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Paper Book Mode
                </div>
            </div>

            <div className="relative">
                <ReadingProgress percentage={percentage} size={200} strokeWidth={8} color="text-blue-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{page}</span>
                    <span className="text-sm text-gray-500">of {totalPages}</span>
                </div>
            </div>

            <div className="w-full max-w-md space-y-6">
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={page <= 0}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handlePageChange(page + 1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">+1</button>
                        <button onClick={() => handlePageChange(page + 5)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">+5</button>
                        <button onClick={() => handlePageChange(page + 10)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">+10</button>
                        <button onClick={() => handlePageChange(page + 20)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">+20</button>
                    </div>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        className="p-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        disabled={page >= totalPages}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>

                <div className="border-t pt-6">
                    <Button
                        onClick={handleFinish}
                        fullWidth
                        size="lg"
                        isLoading={isLoading}
                        icon={<Save size={20} />}
                    >
                        Finish Reading Session
                    </Button>
                </div>
            </div>
        </div>
    );
}
