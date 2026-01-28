import { useCallback, useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { apiClient } from "@/lib/api";

interface UploadZoneProps {
    onUploadComplete?: (data: unknown) => void;
}

const UploadZone = ({ onUploadComplete }: UploadZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient<unknown>("/upload", {
                method: "POST",
                body: formData,
            });
            if (onUploadComplete) onUploadComplete(response);
        } catch (err) {
            setError('Upload failed. Check backend connection.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={`relative rounded-2xl border border-dashed p-6 text-center transition-colors
        ${isDragging ? 'border-accent bg-accent-soft/60' : 'border-border hover:border-ink/30'}
        ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.txt,.docx"
            />

            <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                ) : (
                    <Upload className="h-10 w-10 text-ink/60" />
                )}

                <p className="text-sm font-medium text-ink">
                    {isUploading ? 'Processing Document...' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted">PDF, DOCX, TXT (Max 5MB)</p>

                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default UploadZone;
