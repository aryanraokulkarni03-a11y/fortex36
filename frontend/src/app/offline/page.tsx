'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, RotateCcw, Trophy, ArrowLeft, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Pin {
    id: number
    x: number
    y: number
    knocked: boolean
}

interface Ball {
    x: number
    y: number
    throwing: boolean
    velocity: { x: number; y: number }
}

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [score, setScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
    const [frame, setFrame] = useState(1)
    const [throwsLeft, setThrowsLeft] = useState(2)
    const [highScore, setHighScore] = useState(0)
    const [pins, setPins] = useState<Pin[]>([])
    const [ball, setBall] = useState<Ball>({ x: 200, y: 450, throwing: false, velocity: { x: 0, y: 0 } })
    const [aimAngle, setAimAngle] = useState(0)
    const [power, setPower] = useState(50)
    // const [isAiming, setIsAiming] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)

    // Initialize pins in triangle formation
    const initPins = useCallback((): Pin[] => {
        const pinPositions = [
            { x: 200, y: 80 },   // Pin 1 (front)
            { x: 175, y: 120 },  // Pin 2
            { x: 225, y: 120 },  // Pin 3
            { x: 150, y: 160 },  // Pin 4
            { x: 200, y: 160 },  // Pin 5
            { x: 250, y: 160 },  // Pin 6
            { x: 125, y: 200 },  // Pin 7
            { x: 175, y: 200 },  // Pin 8
            { x: 225, y: 200 },  // Pin 9
            { x: 275, y: 200 },  // Pin 10
        ]
        return pinPositions.map((pos, idx) => ({
            id: idx + 1,
            x: pos.x,
            y: pos.y,
            knocked: false,
        }))
    }, [])

    // Check online status
    useEffect(() => {
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
        }
        const handleOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('bowling-highscore')
        if (saved) setHighScore(parseInt(saved))
    }, [])


    // Start game
    const startGame = () => {
        setGameStarted(true)
        setScore(0)
        setTotalScore(0)
        setFrame(1)
        setThrowsLeft(2)
        setPins(initPins())
        setBall({ x: 200, y: 450, throwing: false, velocity: { x: 0, y: 0 } })
    }

    // Throw ball
    const throwBall = () => {
        if (ball.throwing) return

        const radians = (aimAngle * Math.PI) / 180
        const speed = power / 10

        setBall((prev) => ({
            ...prev,
            throwing: true,
            velocity: {
                x: Math.sin(radians) * speed,
                y: -speed * 1.5,
            },
        }))
    }

    // Game loop
    useEffect(() => {
        if (!gameStarted || !ball.throwing) return

        const animate = () => {
            setBall((prev) => {
                const newX = prev.x + prev.velocity.x
                const newY = prev.y + prev.velocity.y

                // Check if ball is out of bounds or hit pins area
                if (newY < 50) {
                    // Check collision with pins
                    const knockedPins = pins.filter((pin) => {
                        if (pin.knocked) return false
                        const distance = Math.sqrt(
                            Math.pow(newX - pin.x, 2) + Math.pow(newY - pin.y, 2)
                        )
                        return distance < 25
                    })

                    if (knockedPins.length > 0) {
                        const knockedIds = knockedPins.map((p) => p.id)
                        setPins((prevPins) =>
                            prevPins.map((p) =>
                                knockedIds.includes(p.id) ? { ...p, knocked: true } : p
                            )
                        )
                        setScore((prev) => prev + knockedPins.length)
                        setTotalScore((prev) => {
                            const newScore = prev + knockedPins.length
                            setHighScore(h => {
                                if (newScore > h) {
                                    localStorage.setItem('bowling-highscore', newScore.toString())
                                    return newScore
                                }
                                return h
                            })
                            return newScore
                        })
                    }

                    // Reset for next throw
                    setTimeout(() => {
                        setThrowsLeft((prev) => {
                            const newThrows = prev - 1
                            if (newThrows <= 0 || pins.every((p) => knockedPins.some((k) => k.id === p.id) || p.knocked)) {
                                // Next frame
                                setFrame((prevFrame) => {
                                    if (prevFrame >= 10) {
                                        // Game over
                                        setGameStarted(false)
                                        return 1
                                    }
                                    setPins(initPins())
                                    return prevFrame + 1
                                })
                                return 2
                            }
                            return newThrows
                        })
                        setBall({ x: 200, y: 450, throwing: false, velocity: { x: 0, y: 0 } })
                        setScore(0)
                    }, 500)

                    return { x: 200, y: 450, throwing: false, velocity: { x: 0, y: 0 } }
                }

                return {
                    ...prev,
                    x: Math.max(50, Math.min(350, newX)),
                    y: newY,
                }
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [ball.throwing, gameStarted, initPins, pins])

    // Draw game
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !gameStarted) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear
        ctx.fillStyle = '#1c1e26'
        ctx.fillRect(0, 0, 400, 500)

        // Draw lane
        ctx.fillStyle = '#2a2d38'
        ctx.fillRect(50, 0, 300, 500)

        // Lane lines
        ctx.strokeStyle = '#3d4150'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(100, 0)
        ctx.lineTo(100, 500)
        ctx.moveTo(300, 0)
        ctx.lineTo(300, 500)
        ctx.stroke()

        // Draw pins
        pins.forEach((pin) => {
            if (!pin.knocked) {
                ctx.fillStyle = '#ffffff'
                ctx.beginPath()
                ctx.arc(pin.x, pin.y, 12, 0, Math.PI * 2)
                ctx.fill()
                ctx.fillStyle = '#ff4444'
                ctx.beginPath()
                ctx.arc(pin.x, pin.y - 3, 5, 0, Math.PI * 2)
                ctx.fill()
            }
        })

        // Draw ball
        const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, 15)
        gradient.addColorStop(0, '#0088ff')
        gradient.addColorStop(1, '#0055aa')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, 15, 0, Math.PI * 2)
        ctx.fill()

        // Draw aim line if not throwing
        if (!ball.throwing) {
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)'
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
            ctx.beginPath()
            ctx.moveTo(ball.x, ball.y)
            const aimLength = 100 + power
            const radians = (aimAngle * Math.PI) / 180
            ctx.lineTo(
                ball.x + Math.sin(radians) * aimLength,
                ball.y - Math.cos(radians) * aimLength
            )
            ctx.stroke()
            ctx.setLineDash([])
        }
    }, [ball, pins, gameStarted, aimAngle, power])

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Online Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`fixed top-0 left-0 right-0 py-2 px-4 flex items-center justify-center gap-2 text-sm ${isOnline ? 'bg-success text-white' : 'bg-warning text-black'
                    }`}
            >
                {isOnline ? (
                    <>
                        <Wifi className="w-4 h-4" />
                        You&apos;re back online!
                        <Link href="/dashboard">
                            <Button size="sm" variant="ghost" className="ml-2 text-inherit">
                                Return to App
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4" />
                        You&apos;re offline. Play bowling while you wait!
                    </>
                )}
            </motion.div>

            <div className="max-w-lg w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 mt-12"
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2">🎳 SkillSync Bowling</h1>
                    <p className="text-muted-foreground">
                        No connection? No problem! Have some fun while we reconnect.
                    </p>
                </motion.div>

                {/* Game Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            {!gameStarted ? (
                                // Start Screen
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-6">🎳</div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Bowl?</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Knock down all 10 pins to score big!
                                    </p>
                                    {highScore > 0 && (
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            <Trophy className="w-5 h-5 text-warning" />
                                            <span className="text-muted-foreground">High Score: {highScore}</span>
                                        </div>
                                    )}
                                    <Button onClick={startGame} size="lg" className="glow-primary">
                                        <Play className="w-5 h-5" />
                                        Start Game
                                    </Button>
                                </div>
                            ) : (
                                // Game Screen
                                <>
                                    {/* Score Display */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Frame</span>
                                            <p className="text-2xl font-bold text-primary">{frame}/10</p>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-sm text-muted-foreground">Score</span>
                                            <p className="text-3xl font-bold text-foreground">{totalScore}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-muted-foreground">Throws</span>
                                            <p className="text-2xl font-bold text-success">{throwsLeft}</p>
                                        </div>
                                    </div>

                                    {/* Canvas */}
                                    <canvas
                                        ref={canvasRef}
                                        width={400}
                                        height={500}
                                        className="w-full rounded-lg border border-border mb-4"
                                    />

                                    {/* Controls */}
                                    <div className="space-y-4">
                                        {/* Aim Control */}
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Aim: {aimAngle}°
                                            </label>
                                            <input
                                                type="range"
                                                min="-45"
                                                max="45"
                                                value={aimAngle}
                                                onChange={(e) => setAimAngle(parseInt(e.target.value))}
                                                disabled={ball.throwing}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Power Control */}
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Power: {power}%
                                            </label>
                                            <input
                                                type="range"
                                                min="20"
                                                max="100"
                                                value={power}
                                                onChange={(e) => setPower(parseInt(e.target.value))}
                                                disabled={ball.throwing}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={throwBall}
                                                disabled={ball.throwing}
                                                className="flex-1"
                                                size="lg"
                                            >
                                                🎳 Throw Ball
                                            </Button>
                                            <Button
                                                onClick={startGame}
                                                variant="outline"
                                                size="lg"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-6"
                >
                    <Link href="/" className="text-muted-foreground hover:text-foreground transition-smooth inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to SkillSync
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
