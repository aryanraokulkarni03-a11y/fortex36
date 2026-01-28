import { LivingGraph } from "@/components/hero/living-graph";
import { Navbar } from "@/components/layout/navbar";
import { ShinyButton } from "@/components/ui/shiny-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Search, Map, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <Navbar />

      {/* 3D Living Graph Background */}
      <LivingGraph />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl space-y-8 mt-20">
        <GlassCard className="px-4 py-1.5 rounded-full border-primary/30 bg-black/40">
          <span className="text-xs font-mono text-primary animate-pulse">● SYSTEM ONLINE: V2.0</span>
        </GlassCard>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white bg-clip-text">
          LINK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40 block md:inline">NEURAL NET.</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-light">
          The first <span className="text-white font-medium">GraphRAG-powered</span> skills exchange.
          <br />Don't just search mentors. <strong>Discover connections.</strong>
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <ShinyButton className="w-full">
            CONNECT NOW
          </ShinyButton>
          <button className="px-8 py-4 rounded-sm border border-white/10 hover:bg-white/5 text-white font-medium transition-colors w-full">
            VIEW LIVE MAP
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full">
          {[
            { label: "Active Nodes", value: "1,240", icon: Users },
            { label: "Skill Links", value: "8,920", icon: Map },
            { label: "Daily Matches", value: "480+", icon: Zap },
            { label: "Trust Score", value: "98%", icon: Search },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-4 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
              <stat.icon className="w-5 h-5 text-primary/70" />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
