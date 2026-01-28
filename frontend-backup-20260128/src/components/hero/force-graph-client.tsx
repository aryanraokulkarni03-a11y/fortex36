"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { useTheme } from "next-themes";

// Define Graph Node Type
interface GraphNode {
    id: number;
    label: string;
    type: 'user' | 'skill';
    group: number;
    val: number;
    x?: number;
    y?: number;
    z?: number;
}

interface ForceGraphClientProps {
    interactive?: boolean;
    onNodeClick?: (node: GraphNode) => void;
}

export default function ForceGraphClient({
    interactive = false,
    onNodeClick
}: ForceGraphClientProps) {
    const { theme } = useTheme();
    const fgRef = useRef<any>(null);

    // Generate "Living Graph" data
    const data = useMemo(() => {
        // Interactive Map gets more nodes for density
        const N = interactive ? 100 : 50;

        const gData = {
            nodes: [...Array(N).keys()].map((i) => ({
                id: i,
                // Label logic: first 20 are Users, rest are Skills
                label: i < 20 ? `User ${i}` : `Skill ${i}`,
                type: (i < 20 ? 'user' : 'skill') as 'user' | 'skill',
                // Deterministic random
                group: (i * 7) % 5,
                val: (i * 3) % 10 + 2
            })),
            links: [...Array(N).keys()]
                .filter((id) => id > 0)
                .map((id) => ({
                    source: id,
                    target: (id * 5) % id, // Deterministic target
                })),
        };
        return gData;
    }, [interactive]);

    return (
        <div className={`h-full w-full transition-opacity duration-1000 ${interactive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
            <ForceGraph3D
                ref={fgRef}
                graphData={data}
                backgroundColor="rgba(0,0,0,0)" // Transparent for blending
                nodeLabel="label"
                nodeAutoColorBy="group"
                enableNodeDrag={interactive}
                enableNavigationControls={interactive}
                showNavInfo={false}
                onNodeClick={onNodeClick}
                nodeRelSize={interactive ? 6 : 4} // Bigger nodes in map view
                linkColor={() => "rgba(16, 185, 129, 0.4)"} // Acid green traces
                nodeColor={(node: unknown) => (node as GraphNode).group === 1 ? "#10B981" : "#ffffff"}
                linkWidth={1.5}
                linkDirectionalParticles={interactive ? 4 : 2} // More activity in map
                linkDirectionalParticleSpeed={0.005}
                d3VelocityDecay={0.1}
            />
        </div>
    );
}
