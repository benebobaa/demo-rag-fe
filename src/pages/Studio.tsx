import { useCallback, useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";

// Initial Nodes
const initialNodes = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Start' },
        type: 'input',
        style: {
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '999px',
            padding: '10px 20px',
            width: 'auto',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }
    },
    {
        id: '2',
        position: { x: 100, y: 250 },
        data: { label: 'Knowledge Retrieval' },
        style: {
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            width: '200px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }
    },
    {
        id: '3',
        position: { x: 100, y: 450 },
        data: { label: 'LLM Reasoning' },
        style: {
            background: '#fff',
            border: '1px solid #155EEF', // Brand blue
            borderRadius: '8px',
            padding: '16px',
            width: '200px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function Studio() {
    const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const [debugOpen, setDebugOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: async (query: string) => {
            setLogs(prev => [...prev, "🚀 Starting debug session...", `❓ Query: "${query}"`, "🔍 Retrieving knowledge graph..."]);
            return apiClient<any>("/query", {
                method: "POST",
                body: JSON.stringify({ query }),
            });
        },
        onSuccess: (data) => {
            setLogs(prev => [
                ...prev,
                "✅ Knowledge Graph loaded.",
                "🤖 Agent reasoning:",
                ...(data.trace || []).map((t: any) => `  - ${t.step}: ${t.thought}`),
                "🎉 Final Answer:",
                data.answer
            ]);
        },
        onError: () => {
            setLogs(prev => [...prev, "❌ Error: Could not connect to RAG engine."]);
        }
    });

    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [debugQuery, setDebugQuery] = useState("Summarize the key concepts in the documents.");

    const handleOpenDebugModal = () => {
        setIsQueryModalOpen(true);
    };

    const handleConfirmDebug = (e: React.FormEvent) => {
        e.preventDefault();
        setIsQueryModalOpen(false);
        setDebugOpen(true);
        setLogs([]);
        mutation.mutate(debugQuery);
    };

    // Resizable Console Logic
    const [consoleHeight, setConsoleHeight] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback((_mouseDownEvent: React.MouseEvent) => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing) {
                const newHeight = window.innerHeight - mouseMoveEvent.clientY;
                if (newHeight > 100 && newHeight < window.innerHeight - 100) {
                    setConsoleHeight(newHeight);
                }
            }
        },
        [isResizing]
    );

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className="relative flex h-full flex-col">
            <header className="z-10 border-b border-border bg-surface/80">
                <Container className="flex items-center justify-between py-5">
                    <div>
                        <h1 className="text-lg font-semibold text-ink">Orchestrate</h1>
                        <p className="text-sm text-muted">Design your agent workflow.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleOpenDebugModal} disabled={mutation.isPending}>
                            <Play className="h-4 w-4" />
                            {mutation.isPending ? 'Running...' : 'Run Debug'}
                        </Button>
                    </div>
                </Container>
            </header>

            <div className={`relative flex-1 ${isResizing ? 'select-none' : ''}`}>
                <div className="absolute inset-0 hero-glow opacity-40" aria-hidden="true" />
                <div className="absolute inset-0 bg-noise opacity-30" aria-hidden="true" />
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    className="bg-bg"
                >
                    <Background color="#cbd5e1" gap={18} size={1} />
                    <Controls />
                </ReactFlow>

                {/* Debug Console Overlay */}
                {debugOpen && (
                    <div
                        className="absolute bottom-0 left-0 right-0 flex flex-col border-t border-border bg-ink text-white/80 shadow-lg"
                        style={{ height: consoleHeight }}
                    >
                        {/* Resize Handle */}
                        <div
                            className="h-1 w-full cursor-row-resize bg-white/10 transition-colors hover:bg-accent"
                            onMouseDown={startResizing}
                        />

                        <div className="flex items-center justify-between border-b border-white/10 bg-ink/80 px-4 py-2">
                            <span className="text-xs font-mono font-semibold uppercase tracking-[0.3em] text-white/60">Debug Console</span>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setDebugOpen(false)}>
                                    <span className="sr-only">Close</span>
                                    ×
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2 overflow-y-auto p-4 font-mono text-xs">
                            {logs.map((log, i) => (
                                <div key={i} className="break-words">
                                    <span className="mr-2 select-none text-white/40">[{new Date().toLocaleTimeString()}]</span>
                                    {log}
                                </div>
                            ))}
                            {mutation.isPending && (
                                <div className="animate-pulse text-accent">Processing...</div>
                            )}
                        </div>
                    </div>
                )}
                <Modal
                    open={isQueryModalOpen}
                    onClose={() => setIsQueryModalOpen(false)}
                    title="Debug Agent"
                    description="Enter a query to test how the agent resolves it using the knowledge graph."
                >
                    <form onSubmit={handleConfirmDebug} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted">Test Query</label>
                            <Input
                                autoFocus
                                type="text"
                                value={debugQuery}
                                onChange={(e) => setDebugQuery(e.target.value)}
                                placeholder="e.g. How do I explain retrieval augmented generation?"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsQueryModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Run Debug</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
