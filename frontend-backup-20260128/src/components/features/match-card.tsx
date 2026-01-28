"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Check, X, Shield, Star, BookOpen, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
    user: {
        name: string;
        role: string;
        trustScore: number;
        match: number;
        skills: string[];
        lookingFor: string[];
        image?: string;
    };
    onAccept?: () => void;
    onReject?: () => void;
}

export function MatchCard({ user, onAccept, onReject }: MatchCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, x: 100 }}
            className="relative w-full max-w-md mx-auto"
        >
            <GlassCard className="p-0 overflow-visible border-primary/20" hoverEffect={false}>
                {/* Holographic Header */}
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-transparent p-6 flex flex-col justify-end border-b border-white/5">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="text-xs font-mono text-primary animate-pulse">MATCH: {user.match}%</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
                    <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                        <Code className="w-3 h-3" /> {user.role}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Trust Score */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-white/40 font-mono">TRUST SCORE</div>
                        <div className="flex items-center gap-2 text-primary">
                            <Shield className="w-4 h-4 fill-primary/20" />
                            <span className="font-bold text-lg">{user.trustScore}</span>
                        </div>
                    </div>

                    {/* Skill Swap */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> Can Teach
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-secondary">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Star className="w-3 h-3" /> Wants
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.lookingFor.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-primary">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Actions - Neural Link Controls */}
                <div className="p-4 bg-black/40 border-t border-white/5 flex gap-4">
                    <button
                        onClick={onReject}
                        className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 text-white/40 border border-white/10 rounded-sm font-bold text-sm transition-all"
                    >
                        SKIP
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-sm font-bold text-sm transition-all"
                    >
                        CONNECT LINK
                    </button>
                </div>

            </GlassCard>

            {/* Decorative Elements */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-xl -z-10 opacity-20" />
        </motion.div>
    );
}
