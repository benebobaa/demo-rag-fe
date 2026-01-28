import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, CheckCircle2, Loader2, Plus } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

interface GraphData {
    nodes: any[];
    edges: any[];
}

interface UploadResponse {
    filename: string;
    message: string;
    graph: GraphData;
}

interface Dataset {
    id: string;
    name: string;
    size: string;
    date: string;
    status: string;
}

export default function Knowledge() {
    const queryClient = useQueryClient();
    const [isDragging, setIsDragging] = useState(false);

    // Fetch from backend
    const { data: datasets } = useQuery({
        queryKey: ['datasets'],
        queryFn: async () => {
            return apiClient<Dataset[]>("/documents");
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return apiClient<UploadResponse>("/upload", {
                method: "POST",
                body: formData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
            // Invaldiate graph too
            queryClient.invalidateQueries({ queryKey: ['graph'] });
        }
    });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) {
            uploadMutation.mutate(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    return (
        <div className="flex h-full flex-col bg-bg">
            <header className="border-b border-border bg-surface/80">
                <Container className="flex items-center justify-between py-6">
                    <div>
                        <h1 className="text-xl font-semibold text-ink">Knowledge Base</h1>
                        <p className="text-sm text-muted">Manage your documents and data sources.</p>
                    </div>
                    <Button onClick={() => document.getElementById("file-upload")?.click()}>
                        <Plus className="h-4 w-4" />
                        Import Document
                    </Button>
                </Container>
            </header>

            <div className="flex-1 overflow-y-auto">
                <Container className="py-10">
                    <div
                        className={`mb-10 rounded-2xl border border-dashed p-10 text-center transition-colors ${isDragging ? 'border-accent bg-accent-soft/60' : 'border-border hover:border-ink/30'
                            }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && uploadMutation.mutate(e.target.files[0])}
                        />

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                                {uploadMutation.isPending ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                                ) : (
                                    <Upload className="h-6 w-6 text-ink" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-medium text-ink">
                                    {uploadMutation.isPending ? "Uploading & Indexing..." : "Click to upload or drag and drop"}
                                </h3>
                                <p className="text-sm text-muted">PDF, DOCX, TXT (Max 10MB)</p>
                            </div>
                            {uploadMutation.isError && (
                                <p className="mt-2 text-sm text-red-500">Upload failed. Please try again.</p>
                            )}
                            {uploadMutation.isSuccess && (
                                <p className="mt-2 flex items-center justify-center gap-1 text-sm text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" /> Upload Complete
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {datasets?.length === 0 && (
                            <p className="col-span-3 text-center text-muted">No documents found. Upload one to get started.</p>
                        )}
                        {datasets?.map((ds) => (
                            <Card key={ds.id} className="cursor-pointer rounded-2xl border-border/70 bg-surface/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                <div>
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/10 bg-accent-soft text-accent">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <Badge variant="success" className="text-[10px] uppercase">{ds.status}</Badge>
                                    </div>
                                    <h3 className="mb-1 truncate font-semibold text-ink">{ds.name}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted">
                                        <span>{ds.size}</span>
                                        <span>•</span>
                                        <span>{ds.date}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    );
}
