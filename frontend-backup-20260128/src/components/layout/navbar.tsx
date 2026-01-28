"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none"
        >
            <div className="pointer-events-auto">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black font-bold text-xl">
                        S
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                        SkillSync
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-6 pointer-events-auto">
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
                    <Link href="/map" className="hover:text-primary transition-colors">Map</Link>
                    <Link href="/mentors" className="hover:text-primary transition-colors">Mentors</Link>
                    <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
                </div>

                {session ? (
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 hover:text-primary backdrop-blur-md rounded-sm border border-white/10 text-sm font-medium transition-all"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-primary text-black hover:bg-primary/90 rounded-sm text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                    >
                        INITIALIZE
                    </Link>
                )}
            </div>
        </motion.nav>
    );
}
