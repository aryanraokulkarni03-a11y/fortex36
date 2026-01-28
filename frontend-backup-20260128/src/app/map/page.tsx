"use client";

import { Navbar } from "@/components/layout/navbar";
import { GlassCard } from "@/components/ui/glass-card";
import dynamic from "next/dynamic";

const ForceGraph = dynamic(() => import("@/components/hero/force-graph-client"), {
    ssr: false,
    loading: () => <div className="text-primary animate-pulse">Loading Galaxy...</div>
});

export default function MapPage() {
    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            <Navbar />

            <div className="absolute inset-0 z-0">
                <ForceGraph />
            </div>

            <div className="absolute top-24 left-6 z-10 max-w-sm pointer-events-none">
                <GlassCard className="p-4 bg-black/40 border-primary/20 backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-white mb-2">Skill Galaxy</h1>
                    <p className="text-xs text-white/60">
                        Visualizing 1,240 connections.
                        <br />
                        <span className="text-primary animate-pulse">● Live System Activity</span>
                    </p>
                </GlassCard>
            </div>
        </main>
    );
}
