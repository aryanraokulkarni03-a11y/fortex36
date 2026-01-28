'use client'

import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface AnimatedCounterProps {
    value: number
    duration?: number
    delay?: number
    suffix?: string
    prefix?: string
    className?: string
    once?: boolean
}

/**
 * Animated counting number that triggers on scroll
 * Perfect for stats and metrics
 */
export function AnimatedCounter({
    value,
    duration = 2,
    delay = 0,
    suffix = '',
    prefix = '',
    className = '',
    once = true,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })
    const [hasAnimated, setHasAnimated] = useState(false)

    const spring = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    })

    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString()
    )

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timeout = setTimeout(() => {
                spring.set(value)
                setHasAnimated(true)
            }, delay * 1000)
            return () => clearTimeout(timeout)
        }
    }, [isInView, value, spring, delay, hasAnimated])

    return (
        <motion.span ref={ref} className={className}>
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </motion.span>
    )
}

interface AnimatedPercentageProps {
    value: number
    duration?: number
    delay?: number
    className?: string
    once?: boolean
    showBar?: boolean
    barColor?: string
}

/**
 * Animated percentage with optional progress bar
 */
export function AnimatedPercentage({
    value,
    duration = 1.5,
    delay = 0,
    className = '',
    once = true,
    showBar = false,
    barColor = 'bg-primary',
}: AnimatedPercentageProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once, margin: '-50px' })
    const [hasAnimated, setHasAnimated] = useState(false)

    const spring = useSpring(0, {
        duration: duration * 1000,
        bounce: 0,
    })

    const displayValue = useTransform(spring, (current) => Math.round(current))

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timeout = setTimeout(() => {
                spring.set(value)
                setHasAnimated(true)
            }, delay * 1000)
            return () => clearTimeout(timeout)
        }
    }, [isInView, value, spring, delay, hasAnimated])

    return (
        <div ref={ref} className={className}>
            <motion.span className="font-bold">
                {displayValue}%
            </motion.span>
            {showBar && (
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${barColor} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${value}%` } : { width: 0 }}
                        transition={{
                            duration,
                            delay,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    />
                </div>
            )}
        </div>
    )
}

interface CountUpTextProps {
    from: number
    to: number
    duration?: number
    delay?: number
    decimals?: number
    suffix?: string
    prefix?: string
    className?: string
}

/**
 * Simple count up text animation
 */
export function CountUpText({
    from = 0,
    to,
    duration = 2,
    delay = 0,
    decimals = 0,
    suffix = '',
    prefix = '',
    className = '',
}: CountUpTextProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [count, setCount] = useState(from)

    useEffect(() => {
        if (!isInView) return

        const timeout = setTimeout(() => {
            const startTime = Date.now()
            const endValue = to
            const startValue = from

            const tick = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / (duration * 1000), 1)

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3)
                const current = startValue + (endValue - startValue) * eased

                setCount(current)

                if (progress < 1) {
                    requestAnimationFrame(tick)
                }
            }

            requestAnimationFrame(tick)
        }, delay * 1000)

        return () => clearTimeout(timeout)
    }, [isInView, from, to, duration, delay])

    return (
        <span ref={ref} className={className}>
            {prefix}
            {count.toFixed(decimals)}
            {suffix}
        </span>
    )
}
