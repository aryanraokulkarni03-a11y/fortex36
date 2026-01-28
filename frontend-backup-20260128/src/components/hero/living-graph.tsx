"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

const ForceGraph = dynamic(() => import("./force-graph-client"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center text-primary/20 animate-pulse">Initializing Neural Link...</div>
});

export function LivingGraph() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Mask to fade graph into void */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-10" />

            <div className="h-screen w-full scale-110">
                <Suspense fallback={null}>
                    <ForceGraph />
                </Suspense>
            </div>
        </div>
    );
}
