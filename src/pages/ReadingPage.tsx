import { useEffect, useState } from 'react';
import { useReadingStore, Book } from '../stores/readingStore';
import BookCard from '../components/reading/BookCard';
import AddBookModal from '../components/reading/AddBookModal';
import Modal from '../components/common/Modal';
import ResumeModal from '../components/reading/ResumeModal';
import PaperBookReader from '../components/reading/PaperBookReader';
import PDFReader from '../components/reading/PDFReader';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';

export default function ReadingPage() {
    const { books, currentReadingSession, fetchBooks, startSession } = useReadingStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resumeBook, setResumeBook] = useState<Book | null>(null);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Active Session View
    if (currentReadingSession) {
        const book = books.find(b => b.id === currentReadingSession.bookId);
        if (!book) return <div>Book not found</div>;

        if (book.type === 'paper') {
            return (
                <PaperBookReader
                    bookId={book.id}
                    startPage={currentReadingSession.startPage}
                    totalPages={book.total_pages}
                    title={book.title}
                />
            );
        } else {
            return (
                <PDFReader
                    bookId={book.id}
                    startPage={currentReadingSession.startPage}
                    title={book.title}
                />
            );
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-24">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reading Library</h1>
                    <p className="text-gray-500">Track your reading progress.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    icon={<Plus size={20} />}
                    size="lg"
                >
                    Add Book
                </Button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books?.length > 0 && books.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onResume={(b) => setResumeBook(b)}
                    />
                ))}
            </div>

            {books.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">Your library is empty.</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Add your first book
                    </button>
                </div>
            )}



            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Book"
            >
                <AddBookModal onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            <Modal
                isOpen={!!resumeBook}
                onClose={() => setResumeBook(null)}
            >
                {resumeBook && (
                    <ResumeModal
                        book={resumeBook}
                        onConfirm={() => {
                            startSession(resumeBook.id);
                            setResumeBook(null);
                        }}
                        onCancel={() => setResumeBook(null)}
                    />
                )}
            </Modal>
        </div>
    );
}
