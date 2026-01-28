'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightTextProps {
    text: string
    className?: string
    spotlightColor?: string
}

export function SpotlightText({ text, className, spotlightColor = 'rgba(255, 255, 255, 0.25)' }: SpotlightTextProps) {
    const ref = useRef<HTMLHeadingElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth out the mouse movement
    const springConfig = { damping: 25, stiffness: 300 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)

    // 3D Tilt Effect based on mouse position relative to center of text
    const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"])

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    function onMouseLeave() {
        mouseX.set(0)
        mouseY.set(0)
    }

    // Split text for staggered reveal potential (optional, kept simple for now)
    const words = text.split(" ")

    return (
        <motion.div
            className={cn("relative perspective-1000 inline-block cursor-default select-none", className)}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                perspective: "1000px",
            }}
        >
            <motion.h1
                ref={ref}
                className="relative font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60" // Base text style
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* The Text Content */}
                <span className="block">{text}</span>

                {/* The Spotlight/Firefly Glow Effect - Overlaid */}
                <motion.div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                        background: `radial-gradient(
              circle 200px at ${springX.get() * 100 + 50}% ${springY.get() * 100 + 50}%, 
              ${spotlightColor}, 
              transparent 80%
            )`,
                        opacity: 0.8,
                        maskImage: `linear-gradient(to bottom, black, black)`, // Mask to text shape mostly handled by parent mix-blend but let's be safe
                        WebkitMaskImage: `linear-gradient(to bottom, black, black)`,
                    }}
                // We need this gradient to move. We can't interpolate CSS gradients easily in style prop with framer motion values directly in string unless using motion template or useMotionTemplate (cleaner).
                />

                {/* Firefly particles that orbit the text when active */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* We can add small orbiting dots later if needed, keeping it clean for now */}
                </div>

            </motion.h1>

            {/* Glossy Reflection Overlay */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(
                120deg, 
                transparent 30%, 
                rgba(255,255,255,0.1) 45%, 
                rgba(255,255,255,0.0) 50%
            )`,
                    rotateX,
                    rotateY
                }}
            />
        </motion.div>
    )
}
