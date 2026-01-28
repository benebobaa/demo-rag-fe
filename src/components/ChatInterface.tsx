import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { Send, Terminal, Loader2, PlayCircle } from 'lucide-react';
import { apiClient } from "@/lib/api";

interface AgentTrace {
    step: string;
    thought: string;
    tool?: string;
    observation?: string;
}

interface ChatMessage {
    type: 'user' | 'agent' | 'error';
    content: string;
    trace?: AgentTrace[];
}

interface ChatInterfaceProps {
    onQueryComplete?: (highlightedPath: unknown) => void;
}

const ChatInterface = ({ onQueryComplete }: ChatInterfaceProps) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMsg: ChatMessage = { type: 'user', content: query };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        const currentQuery = query;
        setQuery('');

        try {
            const response = await apiClient<{ answer: string; trace?: AgentTrace[]; highlighted_path?: unknown }>("/query", {
                method: "POST",
                body: JSON.stringify({ query: currentQuery }),
            });
            const agentMsg: ChatMessage = {
                type: 'agent',
                content: response.answer,
                trace: response.trace || [],
            };
            setMessages(prev => [...prev, agentMsg]);

            if (onQueryComplete && response.highlighted_path) {
                onQueryComplete(response.highlighted_path);
            }

        } catch (err) {
            const errorMsg: ChatMessage = { type: 'error', content: 'Error processing query.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col border-l border-border bg-surface">
            <div className="flex items-center gap-2 border-b border-border bg-surface/80 p-4 font-semibold">
                <Terminal className="h-4 w-4 text-emerald-600" /> Agent Console
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="mt-10 text-center text-muted">
                        <p>Ready to explore.</p>
                        <p className="text-sm">Ask questions about your uploaded docs.</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] rounded-lg p-3 text-sm ${msg.type === 'user' ? 'bg-accent text-white' :
                                msg.type === 'error' ? 'bg-red-500/10 text-red-600' : 'border border-border bg-surface text-ink'
                            }`}>
                            {msg.content}
                        </div>

                        {msg.trace && msg.trace.length > 0 && (
                            <div className="ml-1 w-full space-y-2 rounded border-l-2 border-emerald-500/50 bg-accent-soft/30 p-2 text-xs font-mono">
                                <p className="flex items-center gap-1 font-bold text-emerald-700">
                                    <PlayCircle className="h-3 w-3" /> Agent Trace
                                </p>
                                {msg.trace.map((step, idx) => (
                                    <div key={idx} className="border-l border-border pl-2">
                                        <span className="text-accent">[{step.step}]</span> {step.tool ? <span className="text-amber-600">using {step.tool}</span> : ''}
                                        <div className="my-1 text-muted">{step.thought}</div>
                                        {step.observation && (
                                            <div className="max-w-xs truncate italic text-muted">{step.observation}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border bg-surface/80 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent/30"
                        placeholder="Ask a question..."
                        value={query}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="rounded-md bg-accent p-2 text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
