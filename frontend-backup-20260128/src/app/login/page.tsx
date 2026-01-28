"use client";

import { signIn } from "next-auth/react";
import { GlassCard } from "@/components/ui/glass-card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Navbar } from "@/components/layout/navbar";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-black">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-black to-primary/5 -z-10" />
            <Navbar />

            <GlassCard className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6 border-primary/20">
                <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center text-black font-bold text-3xl mb-2">
                    S
                </div>

                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Identify Yourself
                </h1>

                <p className="text-white/60">
                    Access the SkillSync Neural Network.<br />
                    An <span className="text-primary font-mono">@srmap.edu.in</span> identity matches is required.
                </p>

                <ShinyButton
                    className="w-full"
                    onClick={() => signIn("email", { callbackUrl: "/dashboard" })}
                >
                    INITIALIZE UPLINK
                </ShinyButton>

                <div className="text-xs text-white/30 pt-4 font-mono">
                    SECURE CONNECTION :: ENCRYPTED
                </div>
            </GlassCard>
        </main>
    );
}
