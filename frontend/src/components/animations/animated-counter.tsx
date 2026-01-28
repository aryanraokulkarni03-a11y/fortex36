'use client'

import { motion, useInView } from 'framer-motion'
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
    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timeout = setTimeout(() => {
                setHasAnimated(true)
                const startTime = Date.now()
                const startValue = 0
                const endValue = value

                const tick = () => {
                    const elapsed = Date.now() - startTime
                    const progress = Math.min(elapsed / (duration * 1000), 1)

                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3)
                    const current = startValue + (endValue - startValue) * eased

                    setDisplayValue(Math.round(current))

                    if (progress < 1) {
                        requestAnimationFrame(tick)
                    }
                }

                requestAnimationFrame(tick)
            }, delay * 1000)
            return () => clearTimeout(timeout)
        }
    }, [isInView, value, duration, delay, hasAnimated])

    return (
        <span ref={ref} className={className}>
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
        </span>
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
    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timeout = setTimeout(() => {
                setHasAnimated(true)
                const startTime = Date.now()

                const tick = () => {
                    const elapsed = Date.now() - startTime
                    const progress = Math.min(elapsed / (duration * 1000), 1)
                    const eased = 1 - Math.pow(1 - progress, 3)
                    const current = value * eased

                    setDisplayValue(Math.round(current))

                    if (progress < 1) {
                        requestAnimationFrame(tick)
                    }
                }

                requestAnimationFrame(tick)
            }, delay * 1000)
            return () => clearTimeout(timeout)
        }
    }, [isInView, value, duration, delay, hasAnimated])

    return (
        <div ref={ref} className={className}>
            <span className="font-bold">
                {displayValue}%
            </span>
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
