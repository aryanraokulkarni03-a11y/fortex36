"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Check, X, Shield, Star, BookOpen, Code, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillCardProps {
    data: {
        label: string;
        group: number;
        val: number;
    };
    onClose: () => void;
}

export function SkillCard({ data, onClose }: SkillCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-80"
        >
            <GlassCard className="p-0 overflow-visible border-primary/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]">

                {/* Header */}
                <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-start">
                    <div>
                        <span className="text-[10px] text-primary font-mono animate-pulse">NODE DETECTED</span>
                        <h3 className="text-xl font-bold text-white mt-1">{data.label}</h3>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white/5 rounded-sm border border-white/5">
                            <div className="text-[10px] text-white/40">CONNECTIONS</div>
                            <div className="text-xl font-bold text-white">{Math.floor(data.val * 3)}</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-sm border border-white/5">
                            <div className="text-[10px] text-white/40">POPULARITY</div>
                            <div className="text-xl font-bold text-white">{Math.floor(data.val * 10)}%</div>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-primary text-black font-bold text-sm hover:bg-white hover:text-black transition-colors rounded-sm">
                        EXPLORE CONNECTIONS
                    </button>
                </div>

            </GlassCard>
        </motion.div>
    );
}
