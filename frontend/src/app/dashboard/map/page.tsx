"use client";

import { useState } from "react";
import { InteractiveGraph } from "@/components/features/interactive-graph";
import { SkillCard } from "@/components/features/skill-card";
import { AnimatePresence } from "framer-motion";
import { ShinyButton } from "@/components/ui/shiny-button";
import { GlassCard } from "@/components/ui/glass-card";

export default function MapPage() {
    const [selectedNode, setSelectedNode] = useState<any>(null);

    return (
        <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden">
            {/* HUD (Heads Up Display) */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <GlassCard className="px-4 py-2 pointer-events-auto flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-bold text-white tracking-widest">LIVE GRAPH</span>
                </GlassCard>
            </div>

            <div className="absolute top-6 right-6 z-20 pointer-events-none flex flex-col gap-2">
                <GlassCard className="px-4 py-3 pointer-events-auto">
                    <div className="text-xs text-white/50 mb-1">FILTERS</div>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs text-primary bg-primary/10 border border-primary/20 rounded-sm">ALL</button>
                        <button className="px-2 py-1 text-xs text-white/60 hover:text-white border border-transparent hover:border-white/10 rounded-sm transition-colors">SKILLS</button>
                        <button className="px-2 py-1 text-xs text-white/60 hover:text-white border border-transparent hover:border-white/10 rounded-sm transition-colors">USERS</button>
                    </div>
                </GlassCard>
            </div>

            {/* The Graph */}
            <InteractiveGraph onNodeClick={setSelectedNode} />

            {/* Floating Node Details */}
            <AnimatePresence>
                {selectedNode && (
                    <SkillCard data={selectedNode} onClose={() => setSelectedNode(null)} />
                )}
            </AnimatePresence>

            {/* Helper Text if no selection */}
            {!selectedNode && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-50">
                    <p className="text-xs text-white font-mono uppercase tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        Click any node to inspect neural connection
                    </p>
                </div>
            )}
        </div>
    );
}
