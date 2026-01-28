"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Control Deck</h1>
                    <p className="text-white/40 font-mono text-sm mt-2">USER_ID: U-8921 // 4TH YEAR CSE // STATUS: ONLINE</p>
                </div>
                <ShinyButton className="px-6 py-2 text-sm">
                    <Sparkles className="w-4 h-4 mr-2 inline-block" />
                    Scan for Matches
                </ShinyButton>
            </div>

            {/* Masonry / Bento Grid - But "Fragmented" as per design */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">

                {/* Main Feed: "The Generative Canvas" */}
                <div className="md:col-span-8 flex flex-col gap-6">

                    {/* AI Insight Card */}
                    <GlassCard className="p-6 relative border-primary/30" gradient>
                        <div className="absolute top-4 right-4 animate-pulse">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Neural Insight detected</h3>
                        <p className="text-white/70 max-w-lg mb-4">
                            Your interest in <span className="text-primary font-mono">React</span> matches highly with <span className="text-white font-bold">Rahul Kumar</span> who is looking for <span className="text-secondary font-mono">Python</span> help.
                        </p>
                        <button className="text-sm font-bold text-primary flex items-center hover:opacity-80 transition-opacity">
                            INITIATE CONNECTION <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </GlassCard>

                    {/* Activity Stream */}
                    <div className="grid grid-cols-2 gap-6 flex-1">
                        <GlassCard className="p-6 flex flex-col justify-between hover:border-white/20">
                            <div>
                                <span className="text-xs font-mono text-white/30">PENDING REQUESTS</span>
                                <div className="text-4xl font-light text-white mt-2">03</div>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-primary w-3/4" />
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 flex flex-col justify-between hover:border-white/20">
                            <div>
                                <span className="text-xs font-mono text-white/30">TRUST SCORE</span>
                                <div className="text-4xl font-light text-white mt-2">98<span className="text-lg text-white/40">%</span></div>
                            </div>
                            <div className="text-xs text-primary mt-2 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> Top 5% of users
                            </div>
                        </GlassCard>
                    </div>

                </div>

                {/* Sidebar Widgets */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Mini Map */}
                    <GlassCard className="flex-1 min-h-[300px] relative group overflow-hidden border-white/5">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                            <h3 className="text-lg font-bold text-white">Live Activity Map</h3>
                            <p className="text-xs text-white/50">50 nodes active near you</p>
                        </div>
                    </GlassCard>

                    <GlassCard className="h-40 p-6">
                        <h3 className="text-sm font-bold text-white mb-4">SKILL GAP ANALYSIS</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Docker", "Kubernetes", "System Design"].map(s => (
                                <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-white/60">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}
