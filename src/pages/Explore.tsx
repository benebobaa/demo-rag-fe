import { useRef, useEffect, useState } from "react";
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
// @ts-ignore
import fcose from 'cytoscape-fcose';
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { RefreshCw, ZoomIn, ZoomOut, Maximize, Search, ChevronRight, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

cytoscape.use(fcose);

interface SearchResult {
    content: string;
    metadata: Record<string, any>;
    score: number;
}

interface SearchResponse {
    query: string;
    results: SearchResult[];
    execution_time_ms: number;
}

export default function Explore() {
    const cyRef = useRef<cytoscape.Core | null>(null);
    const [searchPanelOpen, setSearchPanelOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [numResults, setNumResults] = useState(5);

    const { data: graphData, refetch, isRefetching } = useQuery({
        queryKey: ['graph'],
        queryFn: async () => apiClient<any>("/graph"),
    });

    const searchMutation = useMutation({
        mutationFn: async ({ query, k }: { query: string; k: number }) => {
            return apiClient<SearchResponse>("/search", {
                method: "POST",
                body: JSON.stringify({ query, k }),
            });
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        searchMutation.mutate({ query: searchQuery, k: numResults });
    };

    // Transform backend graph data to Cytoscape elements
    const elements = [
        ...(graphData?.nodes || []).map((n: any) => ({
            data: { id: n.id, label: n.label, type: n.type },
            classes: n.type
        })),
        ...(graphData?.edges || []).map((e: any) => ({
            data: { source: e.source, target: e.target, label: e.relation }
        }))
    ];

    const layout = {
        name: 'fcose',
        quality: "default",
        randomize: false,
        animate: true,
        animationDuration: 1000,
        fit: true,
        padding: 30,
        nodeDimensionsIncludeLabels: true,
    };

    const style = [
        {
            selector: 'node',
            style: {
                'background-color': '#f1f5ff',
                'border-width': 1,
                'border-color': '#93c5fd',
                'label': 'data(label)',
                'text-valign': 'bottom',
                'text-halign': 'center',
                'font-size': '12px',
                'font-family': 'Manrope, Inter, sans-serif',
                'color': '#1f2937',
                'width': 40,
                'height': 40,
                'text-margin-y': 4,
                'overlay-opacity': 0,
            }
        },
        {
            selector: 'node[type="concept"]',
            style: {
                'background-color': '#e0edff',
                'border-color': '#2563eb',
                'color': '#1e3a8a',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#d7dee9',
                'target-arrow-color': '#d7dee9',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '10px',
                'text-background-color': '#ffffff',
                'text-background-opacity': 0.95,
                'text-background-padding': 2,
                'color': '#64748b',
            }
        }
    ];

    useEffect(() => {
        if (cyRef.current && elements.length > 0) {
            cyRef.current.layout(layout).run();
            cyRef.current.fit();
        }
    }, [graphData]);

    // Format similarity score as percentage (assuming cosine similarity where higher = better)
    const formatScore = (score: number) => {
        // Pinecone returns 0-1 for cosine similarity, higher is better
        const percentage = Math.round(score * 100);
        return `${percentage}%`;
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-bg">
            {/* Main Graph Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="z-10 border-b border-border bg-surface/80">
                    <Container className="flex items-center justify-between py-5">
                        <div>
                            <h1 className="text-lg font-semibold text-ink">Graph Explorer</h1>
                            <p className="text-sm text-muted">
                                Visualizing {graphData?.nodes?.length || 0} entities and {graphData?.edges?.length || 0} relationships.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isRefetching}
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                type="button"
                                variant={searchPanelOpen ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSearchPanelOpen(!searchPanelOpen)}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Search Tester
                            </Button>
                        </div>
                    </Container>
                </header>

                <div className="relative flex-1 overflow-hidden">
                    <div className="absolute inset-0 hero-glow opacity-30" aria-hidden="true" />
                    {elements.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
                            <Maximizen className="h-12 w-12 opacity-30" />
                            <p className="font-medium text-ink">No graph data yet.</p>
                            <p className="text-sm">
                                Upload documents in the <span className="font-semibold text-ink">Knowledge</span> tab to build the graph.
                            </p>
                        </div>
                    ) : (
                        <CytoscapeComponent
                            elements={elements}
                            layout={layout}
                            style={{ width: '100%', height: '100%' }}
                            stylesheet={style}
                            cy={(cy: any) => { cyRef.current = cy; }}
                            wheelSensitivity={0.5}
                        />
                    )}

                    {/* Floating Controls */}
                    <div className="glass-panel absolute bottom-6 left-6 flex flex-col gap-2 rounded-xl border border-border p-2 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => cyRef.current?.fit()}>
                            <Maximize className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search Tester Panel */}
            {searchPanelOpen && (
                <div className="flex w-[400px] flex-shrink-0 flex-col border-l border-border bg-surface overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-accent" />
                            <h2 className="font-semibold text-ink">Search Tester</h2>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setSearchPanelOpen(false)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="p-4">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted">Search Query</label>
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter your search query..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted">
                                    Number of results: <span className="font-semibold text-ink">{numResults}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={numResults}
                                    onChange={(e) => setNumResults(parseInt(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-muted">
                                    <span>1</span>
                                    <span>10</span>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={searchMutation.isPending || !searchQuery.trim()}>
                                {searchMutation.isPending ? "Searching..." : "Search"}
                            </Button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto border-t border-border">
                        {searchMutation.data && (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between text-xs text-muted">
                                    <span>{searchMutation.data.results.length} results</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {searchMutation.data.execution_time_ms.toFixed(0)}ms
                                    </span>
                                </div>

                                {searchMutation.data.results.map((result, idx) => (
                                    <div key={idx} className="rounded-lg border border-border bg-white p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-accent">#{idx + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-16 rounded-full bg-gray-200 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                                        style={{ width: `${Math.min(result.score * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-ink">
                                                    {formatScore(result.score)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-ink line-clamp-4">{result.content}</p>
                                        {result.metadata?.source && (
                                            <div className="flex items-center gap-1 text-xs text-muted">
                                                <FileText className="h-3 w-3" />
                                                {result.metadata.source}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchMutation.isError && (
                            <div className="p-4">
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    Error: {(searchMutation.error as Error)?.message || "Search failed"}
                                </div>
                            </div>
                        )}

                        {!searchMutation.data && !searchMutation.isPending && !searchMutation.isError && (
                            <div className="flex h-32 items-center justify-center text-sm text-muted">
                                Enter a query to test similarity search
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Maximizen({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
    )
}

