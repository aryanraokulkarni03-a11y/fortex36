"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Copy, Maximize2 } from "lucide-react";

const ForceGraphRaw = dynamic(() => import("@/components/hero/force-graph-client"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center text-primary/20 animate-pulse">Scanning Neural Network...</div>
});

export function InteractiveGraph({ onNodeClick }: { onNodeClick?: (node: { id: number; label: string }) => void }) {
    return (
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">
            <Suspense fallback={null}>
                <ForceGraphRaw interactive={true} onNodeClick={onNodeClick} />
            </Suspense>
        </div>
    );
}
