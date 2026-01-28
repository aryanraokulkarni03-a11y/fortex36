"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    gradient?: boolean;
    hoverEffect?: boolean;
    children?: React.ReactNode;
}

export function GlassCard({
    className,
    gradient = false,
    hoverEffect = true,
    children,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={hoverEffect ? { opacity: 0, y: 20 } : undefined}
            animate={hoverEffect ? { opacity: 1, y: 0 } : undefined}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 0 30px -10px var(--primary)" } : undefined}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                // Base Glass
                "relative overflow-hidden rounded-md border border-white/10 bg-black/40 backdrop-blur-md",
                // Noise texture overlay (simulated with grain)
                "before:absolute before:inset-0 before:opacity-[0.03] before:bg-[url('/noise.svg')]",
                // Optional Gradient
                gradient && "bg-gradient-to-br from-white/5 to-transparent",
                className
            )}
            {...props}
        >
            {/* Searchlight effect on top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity hover:opacity-100" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
