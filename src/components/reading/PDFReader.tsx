import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useReadingStore } from '../../stores/readingStore';
import Button from '../common/Button';
import { ChevronLeft, ChevronRight, Save, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import ReadingProgress from './ReadingProgress';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface PDFReaderProps {
    bookId: number;
    startPage: number;
    title: string;
}

export default function PDFReader({ bookId, startPage, title }: PDFReaderProps) {
    const { endSession, updateProgress, isLoading } = useReadingStore();
    const [pageNumber, setPageNumber] = useState(startPage || 1);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [scale, setScale] = useState(1.0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const changePage = (offset: number) => {
        setPageNumber(prev => Math.min(numPages || prev, Math.max(1, prev + offset)));
    };

    const handleFinish = async () => {
        await endSession(pageNumber);
    };

    if (!file) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                    <Upload size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Select PDF File</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Please select the PDF file for <strong className="text-gray-900">{title}</strong> from your device to start reading. Do not worry, the file is not uploaded to our server.
                    </p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="primary" size="lg">
                        Choose File
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-h-[calc(100vh-100px)]">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-gray-900 truncate max-w-[200px]">{title}</h2>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:bg-gray-100 rounded">
                            <ZoomOut size={18} />
                        </button>
                        <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="p-1 hover:bg-gray-100 rounded">
                            <ZoomIn size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-50 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium w-20 text-center">
                            {pageNumber} / {numPages || '--'}
                        </span>
                        <button
                            onClick={() => changePage(1)}
                            disabled={numPages ? pageNumber >= numPages : false}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-50 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <Button
                        size="sm"
                        onClick={handleFinish}
                        isLoading={isLoading}
                        icon={<Save size={16} />}
                    >
                        Save & Exit
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-8 custom-scrollbar">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center gap-2 text-gray-500 mt-10">
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Loading PDF...
                        </div>
                    }
                    error={
                        <div className="text-red-500 mt-10">
                            Failed to load PDF. Please check if the file is valid.
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-xl"
                    />
                </Document>
            </div>
        </div>
    );
}
