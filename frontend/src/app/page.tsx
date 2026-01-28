'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StaggerContainer, StaggerItem, StaggerReveal } from '@/components/animations/stagger-reveal'
import { AnimatedCounter } from '@/components/animations/animated-counter'
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Users,
    Zap,
    Target,
    MessageCircle,
    Star,
    Check,
    ChevronRight,
} from 'lucide-react'

// Stats data
const stats = [
    { label: 'Active Students', value: 500, suffix: '+' },
    { label: 'Skills Matched', value: 1200, suffix: '+' },
    { label: 'Sessions Completed', value: 850, suffix: '+' },
    { label: 'Match Accuracy', value: 94, suffix: '%' },
]

// How it works steps
const steps = [
    {
        icon: BookOpen,
        title: 'Add Your Skills',
        description: 'Tell us what you can teach and what you want to learn',
    },
    {
        icon: Target,
        title: 'Get AI Matches',
        description: 'Our GraphRAG finds your perfect peer mentors',
    },
    {
        icon: MessageCircle,
        title: 'Connect & Learn',
        description: 'Schedule sessions and start your learning journey',
    },
]

// Features
const features = [
    'AI-powered matching with GraphRAG',
    'Peer-to-peer learning network',
    'Campus-verified students only',
    'Real-time collaboration tools',
    'Progress tracking & badges',
    'Trust-based rating system',
]

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })

    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

    return (
        <div className="min-h-screen bg-background grain">
            <Navbar />

            {/* ===== HERO SECTION - RADICAL TYPOGRAPHY-FIRST ===== */}
            <section
                ref={heroRef}
                className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
            >
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Gradient Orbs - Enhanced */}
                    <motion.div
                        className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[100px]"
                        style={{
                            background: 'radial-gradient(circle, rgba(0, 138, 255, 0.2) 0%, transparent 70%)',
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[120px]"
                        style={{
                            background: 'radial-gradient(circle, rgba(61, 214, 140, 0.15) 0%, transparent 70%)',
                        }}
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white opacity-20"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: Math.random() * 3 + 1,
                                height: Math.random() * 3 + 1,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: Math.random() * 2
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content - CENTERED, MASSIVE */}
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                    className="relative z-10 max-w-7xl mx-auto px-4 text-center flex flex-col items-center justify-center"
                >
                    {/* Badge - Glass Capsule */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Sparkles className="w-4 h-4 text-warning animate-pulse" />
                            <span className="text-sm font-medium text-muted-foreground/80 tracking-wide">
                                POWERED BY GRAPHRAG AI
                            </span>
                        </div>
                    </motion.div>

                    {/* MASSIVE HEADLINE */}
                    <h1 className="relative font-bold tracking-tighter leading-[0.9] mb-8 text-foreground">
                        <motion.span
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="block text-[4rem] sm:text-[6rem] md:text-[7rem] lg:text-[8.5rem]"
                        >
                            Learn from
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="block text-gradient-hero text-[4.5rem] sm:text-[6.5rem] md:text-[7.5rem] lg:text-[9rem]"
                        >
                            Your Peers
                        </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        AI-powered peer learning network for SRM AP.
                        <br />
                        <span className="text-foreground font-medium">Find mentors. Share knowledge. Grow together.</span>
                    </motion.p>

                    {/* CTA Buttons - Chunky & Premium */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full"
                    >
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto text-lg h-14 px-8 rounded-full glow-primary pulse-glow font-semibold tracking-wide"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/matches" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/10 hover:bg-white/5 hover-lift backdrop-blur-sm"
                            >
                                Explore Mentors
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="relative py-16 border-y border-border/50 glass-strong">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <StaggerReveal
                                key={stat.label}
                                delay={idx * 0.1}
                                className="text-center"
                            >
                                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        duration={2}
                                        delay={0.2 + idx * 0.1}
                                    />
                                </p>
                                <p className="text-muted-foreground">{stat.label}</p>
                            </StaggerReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <StaggerReveal className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">
                            How It Works
                        </Badge>
                        <h2 className="text-display text-foreground mb-4">
                            3 Steps to Start Learning
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Our AI-powered matching finds you the perfect peer mentor in seconds.
                        </p>
                    </StaggerReveal>

                    {/* Steps */}
                    <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
                        {steps.map((step, idx) => (
                            <StaggerItem key={step.title}>
                                <div className="relative group">
                                    {/* Connection Line (hidden on mobile, visible between cards) */}
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                                    )}

                                    <div className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 interactive-card">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                                            {idx + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:glow-primary transition-smooth">
                                            <step.icon className="w-8 h-8 text-primary" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-foreground mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-24 relative bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <StaggerReveal direction="right">
                            <Badge variant="outline" className="mb-4">
                                <Zap className="w-3 h-3 mr-1" />
                                Features
                            </Badge>
                            <h2 className="text-display text-foreground mb-6">
                                Everything You Need to Learn & Teach
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                SkillSync combines AI-powered matching with a vibrant peer community
                                to create the ultimate learning experience.
                            </p>

                            {/* Feature List */}
                            <ul className="space-y-4 mb-8">
                                {features.map((feature, idx) => (
                                    <motion.li
                                        key={feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-success" />
                                        </div>
                                        <span className="text-foreground">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <Link href="/signup">
                                <Button size="lg" className="hover-lift">
                                    Start Learning Now
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Button>
                            </Link>
                        </StaggerReveal>

                        {/* Right - Visual */}
                        <StaggerReveal direction="left" delay={0.2}>
                            <div className="relative">
                                {/* Main Card */}
                                <div className="bg-card border border-border rounded-3xl p-8 glass-card elevated-xl">
                                    {/* Mock Profile Match */}
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/50 rounded-2xl">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center text-white font-bold">
                                            RK
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">Rahul Kumar</p>
                                            <p className="text-sm text-muted-foreground">
                                                Teaching: Machine Learning
                                            </p>
                                        </div>
                                        <Badge variant="success">94% Match</Badge>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6 p-4 bg-secondary/50 rounded-2xl">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-success to-warning flex items-center justify-center text-white font-bold">
                                            PS
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">Priya Singh</p>
                                            <p className="text-sm text-muted-foreground">
                                                Teaching: React & Node.js
                                            </p>
                                        </div>
                                        <Badge variant="success">91% Match</Badge>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warning to-primary flex items-center justify-center text-white font-bold">
                                            AP
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">Amit Patel</p>
                                            <p className="text-sm text-muted-foreground">
                                                Teaching: Data Science
                                            </p>
                                        </div>
                                        <Badge variant="success">88% Match</Badge>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-success rounded-xl px-4 py-2 elevated flex items-center gap-2"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Star className="w-4 h-4 text-success-foreground" />
                                    <span className="text-sm font-semibold text-success-foreground">
                                        AI Matched
                                    </span>
                                </motion.div>
                            </div>
                        </StaggerReveal>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-24 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <StaggerReveal>
                        <h2 className="text-display text-foreground mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                            Join hundreds of SRM AP students already learning and growing together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="text-lg px-10 py-6 glow-primary-intense"
                                >
                                    Create Free Account
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="text-lg px-8 py-6"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </StaggerReveal>
                </div>
            </section>

            <Footer />
        </div>
    )
}
