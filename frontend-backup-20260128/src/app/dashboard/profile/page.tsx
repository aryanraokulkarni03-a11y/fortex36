"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Edit, Share2, Award, Zap } from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

const SKILL_DATA = [
    { subject: 'React', A: 120, fullMark: 150 },
    { subject: 'Python', A: 98, fullMark: 150 },
    { subject: 'System Design', A: 86, fullMark: 150 },
    { subject: 'UI/UX', A: 99, fullMark: 150 },
    { subject: 'Solidity', A: 45, fullMark: 150 },
    { subject: 'DevOps', A: 65, fullMark: 150 },
];

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            {/* Header Profile */}
            <div className="relative">
                <div className="h-48 rounded-lg bg-gradient-to-r from-primary/10 via-black to-primary/5 border-b border-white/10" />
                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-zinc-900 overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">🐱</div>
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <div className="mb-2">
                        <h1 className="text-3xl font-black text-white">CyberCat_99</h1>
                        <p className="text-white/40 font-mono">Full Stack • Level 42</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <ShinyButton className="px-4 py-2 text-xs">
                        <Edit className="w-3 h-3 mr-2 inline" /> EDIT
                    </ShinyButton>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Left: Skill DNA */}
                <div className="md:col-span-8">
                    <GlassCard className="p-6 h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" /> SKILL DNA
                            </h3>
                            <span className="text-xs font-mono text-white/30">UPDATED 2H AGO</span>
                        </div>

                        <div className="flex-1 w-full h-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 12, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Skills"
                                        dataKey="A"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fill="#10B981"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>

                {/* Right: Stats & Badges */}
                <div className="md:col-span-4 space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-sm font-bold text-white text-center mb-6">TRUST VALIDATION</h3>
                        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                                <circle cx="80" cy="80" r="70" stroke="#10B981" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset="40" strokeLinecap="round" />
                            </svg>
                            <div className="text-center">
                                <div className="text-4xl font-black text-white">92</div>
                                <div className="text-[10px] text-primary">ELITE TIER</div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-sm font-bold text-white mb-4">BADGES</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-sm border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group tooltip">
                                    <Award className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}
