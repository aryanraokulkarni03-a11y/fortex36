'use client'

import { motion, type MotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface FadeInProps extends MotionProps {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

/**
 * Fade in animation wrapper
 */
export function FadeIn({
    children,
    delay = 0,
    duration = 0.25,
    className,
    ...props
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

interface SlideUpProps extends MotionProps {
    children: ReactNode
    delay?: number
    duration?: number
    y?: number
    className?: string
}

/**
 * Slide up animation wrapper
 */
export function SlideUp({
    children,
    delay = 0,
    duration = 0.4,
    y = 20,
    className,
    ...props
}: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

interface ScaleInProps extends MotionProps {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

/**
 * Scale in animation wrapper
 */
export function ScaleIn({
    children,
    delay = 0,
    duration = 0.25,
    className,
    ...props
}: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

interface StaggerContainerProps {
    children: ReactNode
    staggerDelay?: number
    className?: string
}

/**
 * Container for staggered animations
 */
export function StaggerContainer({
    children,
    staggerDelay = 0.05,
    className,
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Child item for staggered container
 */
export function StaggerItem({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.35,
                        ease: [0.4, 0, 0.2, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
