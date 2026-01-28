'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface StaggerRevealProps {
    children: ReactNode
    className?: string
    delay?: number
    staggerDelay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    distance?: number
    once?: boolean
    duration?: number
}

/**
 * Scroll-triggered reveal animation with stagger support
 * Wrap elements in this component to reveal them when they enter the viewport
 */
export function StaggerReveal({
    children,
    className = '',
    delay = 0,
    staggerDelay = 0.1,
    direction = 'up',
    distance = 30,
    once = true,
    duration = 0.5,
}: StaggerRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: distance }
            case 'down':
                return { y: -distance }
            case 'left':
                return { x: distance }
            case 'right':
                return { x: -distance }
            case 'none':
                return {}
            default:
                return { y: distance }
        }
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...getInitialPosition() }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface StaggerContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    once?: boolean
}

/**
 * Container for staggered children animations
 * Children wrapped in StaggerItem will animate with stagger delay
 */
export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    once = true,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface StaggerItemProps {
    children: ReactNode
    className?: string
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    distance?: number
    duration?: number
}

/**
 * Individual item within StaggerContainer
 * Automatically staggered based on container settings
 */
export function StaggerItem({
    children,
    className = '',
    direction = 'up',
    distance = 30,
    duration = 0.5,
}: StaggerItemProps) {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: distance }
            case 'down':
                return { y: -distance }
            case 'left':
                return { x: distance }
            case 'right':
                return { x: -distance }
            case 'none':
                return {}
            default:
                return { y: distance }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, ...getInitialPosition() },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    )
}

/**
 * Fade in animation on scroll
 */
export function FadeIn({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
    once = true,
}: {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    once?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Scale up animation on scroll
 */
export function ScaleIn({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
    once = true,
}: {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    once?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{
                duration,
                delay,
                ease: [0.34, 1.56, 0.64, 1], // spring-like
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
