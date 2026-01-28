import { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';

interface GraphNode {
    id: string;
    label: string;
    type?: string;
}

interface GraphEdge {
    source: string;
    target: string;
    relation: string;
}

interface GraphData {
    nodes?: GraphNode[];
    edges?: GraphEdge[];
}

interface GraphViewProps {
    graphData?: GraphData;
    onNodeClick?: (data: GraphNode) => void;
}

const GraphView = ({ graphData, onNodeClick }: GraphViewProps) => {
    const cyRef = useRef<cytoscape.Core | null>(null);

    const elements = [
        ...(graphData?.nodes?.map((n) => ({ data: { id: n.id, label: n.label, type: n.type } })) || []),
        ...(graphData?.edges?.map((e) => ({ data: { source: e.source, target: e.target, label: e.relation } })) || [])
    ];

    const layout = {
        name: 'cose',
        animate: true,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
    };

    const style = [
        {
            selector: 'node',
            style: {
                'background-color': '#e7efff',
                'label': 'data(label)',
                'color': '#1f2937',
                'text-valign': 'center',
                'text-halign': 'center',
                'width': 'label',
                'height': 'label',
                'padding': '10px',
                'shape': 'round-rectangle',
                'text-wrap': 'wrap',
                'text-max-width': '100px',
                'font-size': '12px',
                'font-family': 'Manrope, Inter, sans-serif'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#cbd5e1',
                'target-arrow-color': '#cbd5e1',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '10px',
                'color': '#64748b',
                'text-rotation': 'autorotate',
                'text-background-color': '#ffffff',
                'text-background-opacity': 0.9,
                'text-background-padding': '3px',
                'font-family': 'Manrope, Inter, sans-serif'
            }
        },
        {
            selector: ':selected',
            style: {
                'background-color': '#2563eb',
                'line-color': '#2563eb',
                'target-arrow-color': '#2563eb',
                'source-arrow-color': '#2563eb',
            }
        }
    ];

    useEffect(() => {
        if (cyRef.current) {
            cyRef.current.layout(layout).run();
            cyRef.current.on('tap', 'node', (evt: cytoscape.EventObject) => {
                const node = evt.target as cytoscape.NodeSingular;
                if (onNodeClick) onNodeClick(node.data() as GraphNode);
            });
        }
    }, [graphData]);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <CytoscapeComponent
                elements={elements}
                style={style}
                layout={layout}
                cy={(cy: cytoscape.Core) => { cyRef.current = cy; }}
                className="w-full h-full"
            />
        </div>
    );
};

export default GraphView;
