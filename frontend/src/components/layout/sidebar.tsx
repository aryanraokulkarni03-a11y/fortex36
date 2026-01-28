"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Map as MapIcon,
    Zap,
    User,
    Settings,
    LogOut,
    Hexagon
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Overview", icon: Hexagon }, // Hexagon = Skill Node
        { href: "/dashboard/map", label: "Skill Graph", icon: MapIcon },
        { href: "/dashboard/matches", label: "Neural Links", icon: Zap },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/stats", label: "Analytics", icon: BarChart3 },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 z-40 hidden md:flex flex-col">
            {/* Brand */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary/20 border border-primary text-primary rounded-sm flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-black transition-all duration-300">
                        S
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-white">SkillSync</h1>
                        <p className="text-[10px] text-primary uppercase tracking-widest font-mono">Neural Net V2</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
                            )}
                            <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-white/40 group-hover:text-white")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-white/40 hover:text-red-400 transition-colors rounded-sm hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Disconnect
                </button>
            </div>
        </aside>
    );
}
