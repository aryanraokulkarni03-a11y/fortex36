"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
}

export function ShinyButton({ children, className, ...props }: ShinyButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative rounded-sm px-8 py-4 font-bold text-black overflow-hidden group",
                "bg-primary",
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0" />

            {/* Glow bloom */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary blur-md z-[-1]" />
        </motion.button>
    );
}
