import { useState, useRef, useEffect } from "react";
import { Send, Settings2, Sparkles, ChevronDown, ChevronRight, Terminal, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { streamSse } from "@/lib/stream";
import { formatElapsed } from "@/lib/time";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentTrace {
    step: string;
    thought: string;
    tool?: string;
    observation?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    trace?: AgentTrace[];
    status?: string;
    isStreaming?: boolean;
    isError?: boolean;
}

export default function Playground() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [elapsedMs, setElapsedMs] = useState(0);
    const [status, setStatus] = useState<string | null>(null);
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const startedAtRef = useRef<number | null>(null);
    const streamEndedRef = useRef(false);

    const createId = () => {
        if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };
    const updateMessage = (id: string, updater: (msg: Message) => Message) => {
        setMessages(prev => prev.map(msg => (msg.id === id ? updater(msg) : msg)));
    };

    const handleStreamEvent = (messageId: string, event: { event: string; data: any }) => {
        if (event.event === "status") {
            const nextStatus = event.data?.message || event.data?.stage || "Working...";
            setStatus(nextStatus);
            return;
        }

        if (event.event === "trace") {
            const traceEntry: AgentTrace = {
                step: event.data?.step || "Trace",
                thought: event.data?.thought || "",
                tool: event.data?.tool,
                observation: event.data?.observation,
            };
            updateMessage(messageId, msg => ({
                ...msg,
                trace: [...(msg.trace || []), traceEntry],
            }));
            return;
        }

        if (event.event === "answer") {
            updateMessage(messageId, msg => ({
                ...msg,
                content: event.data?.answer || msg.content,
            }));
            return;
        }

        if (event.event === "error") {
            streamEndedRef.current = true;
            setIsStreaming(false);
            setStatus(null);
            abortRef.current = null;
            updateMessage(messageId, msg => ({
                ...msg,
                content: event.data?.message || "Error: Could not reach agent.",
                isStreaming: false,
                isError: true,
            }));
            return;
        }

        if (event.event === "done") {
            streamEndedRef.current = true;
            setIsStreaming(false);
            setStatus(null);
            abortRef.current = null;
            if (event.data?.session_id) {
                setSessionId(event.data.session_id);
            }
            updateMessage(messageId, msg => ({
                ...msg,
                isStreaming: false,
            }));
        }
    };

    const startStream = async (query: string, messageId: string) => {
        streamEndedRef.current = false;
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            await streamSse({
                endpoint: "/query/stream",
                body: { query, session_id: sessionId },
                signal: controller.signal,
                onEvent: (event) => handleStreamEvent(messageId, event),
            });

            if (!streamEndedRef.current) {
                streamEndedRef.current = true;
                setIsStreaming(false);
                setStatus(null);
                updateMessage(messageId, msg => ({
                    ...msg,
                    content: "Connection lost. Please retry.",
                    isStreaming: false,
                    isError: true,
                }));
            }
        } catch (error) {
            if (!streamEndedRef.current) {
                streamEndedRef.current = true;
                setIsStreaming(false);
                setStatus(null);
                updateMessage(messageId, msg => ({
                    ...msg,
                    content: error instanceof Error ? error.message : "Error: Could not reach agent.",
                    isStreaming: false,
                    isError: true,
                }));
            }
        }
    };

    const stopStream = () => {
        if (!isStreaming || !abortRef.current || !activeMessageId) return;
        streamEndedRef.current = true;
        abortRef.current.abort();
        setIsStreaming(false);
        setStatus(null);
        abortRef.current = null;
        updateMessage(activeMessageId, msg => ({
            ...msg,
            content: "Stopped by user.",
            isStreaming: false,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        const query = input.trim();
        const userId = createId();
        const assistantId = createId();
        const startedAt = Date.now();

        startedAtRef.current = startedAt;
        setElapsedMs(0);
        setStatus("Planning response...");
        setActiveMessageId(assistantId);
        setIsStreaming(true);

        setMessages(prev => [
            ...prev,
            { id: userId, role: 'user', content: query },
            {
                id: assistantId,
                role: 'assistant',
                content: "Working...",
                trace: [],
                isStreaming: true,
            }
        ]);

        setInput("");
        void startStream(query, assistantId);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    useEffect(() => {
        if (!isStreaming || startedAtRef.current === null) return;
        const interval = setInterval(() => {
            setElapsedMs(Date.now() - startedAtRef.current!);
        }, 250);
        return () => clearInterval(interval);
    }, [isStreaming]);

    return (
        <div className="flex h-full bg-bg">
            {/* Left Panel: Configuration */}
            <div className="flex w-[300px] flex-col gap-6 border-r border-border bg-surface/90 p-4">
                <div>
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
                        <Settings2 className="h-4 w-4" /> Configuration
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted">Model</label>
                            <Select>
                                <option>DeepSeek-V3</option>
                                <option>GPT-4o</option>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted">System Prompt</label>
                            <textarea
                                className="min-h-[110px] w-full resize-none rounded-md border border-border bg-surface p-3 text-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                                defaultValue="You are a helpful knowledge assistant. Use the graph tools provided to answer questions."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat */}
            <div className="relative flex flex-1 flex-col bg-bg">
                <div className="flex-1 space-y-8 overflow-y-auto p-8" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-muted">
                            <Sparkles className="mb-4 h-12 w-12 opacity-30" />
                            <p>Start a conversation with your agent.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] space-y-2`}>

                                {/* Message Bubble */}
                                <div className={cn(
                                    "rounded-xl p-4 text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "rounded-br-none bg-accent text-white"
                                        : msg.isError
                                            ? "rounded-bl-none border border-red-200 bg-red-50 text-red-700"
                                            : "rounded-bl-none border border-border bg-surface text-ink"
                                )}>
                                    {msg.isStreaming && msg.id === activeMessageId && (
                                        <div className="mb-2 flex items-center justify-between text-xs text-muted">
                                            <span>{status || "Working..."}</span>
                                            <span>{formatElapsed(elapsedMs)}</span>
                                        </div>
                                    )}
                                    <div className={cn(
                                        "prose prose-sm max-w-none break-words",
                                        msg.role === 'user'
                                            ? "prose-invert text-white"
                                            : msg.isError
                                                ? "text-red-700"
                                                : "text-ink"
                                    )}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Override basic elements to fit the bubble better
                                                ul: ({ node, ...props }) => <ul className="my-2 list-disc pl-4" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="my-2 list-decimal pl-4" {...props} />,
                                                li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                h1: ({ node, ...props }) => <h1 className="mb-2 mt-4 text-lg font-bold first:mt-0" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="mb-2 mt-3 text-base font-bold" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="mb-1 mt-2 text-sm font-bold" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="my-2 border-l-2 border-border pl-4 italic" {...props} />,
                                                code: ({ node, ...props }) => <code className="rounded bg-ink/10 px-1 py-0.5 font-mono text-xs" {...props} />,
                                                pre: ({ node, ...props }) => <pre className="my-2 overflow-x-auto rounded-lg bg-ink text-white p-3 text-xs" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Trace Accordion (Citations) */}
                                {(msg.isStreaming || (msg.trace && msg.trace.length > 0)) && (
                                    <TraceAccordion
                                        trace={msg.trace || []}
                                        status={msg.id === activeMessageId ? status : null}
                                        defaultOpen={Boolean(msg.isError)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border bg-surface px-4 py-4">
                    <form onSubmit={handleSubmit} className="relative mx-auto max-w-4xl">
                        <div className="flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your knowledge base..."
                                className="h-12 text-base shadow-sm"
                                disabled={isStreaming}
                            />
                            {isStreaming ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={stopStream}
                                    className="h-12 px-4"
                                >
                                    <Square className="h-4 w-4" />
                                    Stop
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim()}
                                    className="h-12 w-12 transition-transform active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function TraceAccordion({
    trace,
    status,
    defaultOpen = false,
}: {
    trace: AgentTrace[];
    status?: string | null;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
        if (defaultOpen) {
            setIsOpen(true);
        }
    }, [defaultOpen]);

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-surface text-xs">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between bg-accent-soft px-3 py-2 text-muted transition-colors hover:text-ink"
            >
                <span className="flex items-center gap-2">
                    <Terminal className="h-3 w-3 text-emerald-600" />
                    Trace ({trace.length} events)
                </span>
                {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {isOpen && (
                <div className="space-y-3 bg-white p-3">
                    {status && (
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Status: {status}
                        </div>
                    )}
                    {trace.map((step, i) => (
                        <div key={i} className="space-y-1 border-l-2 border-border pl-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">{step.step}</span>
                                {step.tool && <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">{step.tool}</span>}
                            </div>
                            <p className="text-muted">{step.thought}</p>
                            {step.observation && (
                                <div className="mt-1 overflow-x-auto rounded border border-border bg-accent-soft/40 p-2 font-mono text-muted">
                                    {step.observation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
