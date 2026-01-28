"use client";

import { useState } from "react";
import { MatchCard } from "@/components/features/match-card";
import { AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

// MOCK DATA
const MOCK_MATCHES = [
    {
        id: 1,
        name: "Rahul Kumar",
        role: "Full Stack Dev",
        trustScore: 98,
        match: 94,
        skills: ["React", "Node.js", "TypeScript"],
        lookingFor: ["Python", "ML Basics"],
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Data Scientist",
        trustScore: 92,
        match: 89,
        skills: ["Python", "TensorFlow", "Pandas"],
        lookingFor: ["Web Dev", "React"],
    },
    {
        id: 3,
        name: "Arjun Singh",
        role: "Cloud Engineer",
        trustScore: 95,
        match: 85,
        skills: ["AWS", "Docker"],
        lookingFor: ["System Design"],
    },
];

export default function MatchesPage() {
    const [matches, setMatches] = useState(MOCK_MATCHES);
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex(prev => prev + 1);
    };

    const currentMatch = matches[index];

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Neural Links</h1>
                <p className="text-white/40 text-sm">Suggested peer connections based on graph proximity.</p>
            </div>

            <div className="w-full max-w-md relative h-[500px]">
                <AnimatePresence mode="wait">
                    {currentMatch ? (
                        <MatchCard
                            key={currentMatch.id}
                            user={currentMatch}
                            onAccept={handleNext}
                            onReject={handleNext}
                        />
                    ) : (
                        <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="mb-4 text-4xl">🌌</div>
                            <h2 className="text-xl font-bold text-white">All Links Explored</h2>
                            <p className="text-white/40 mt-2">Checking graph for new activity...</p>
                        </GlassCard>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
