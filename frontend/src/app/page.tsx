'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Users, Brain, Sparkles, ArrowRight, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { useGraphStats } from '@/lib/hooks/use-matches'

export default function LandingPage() {
    const { data: stats } = useGraphStats()
    // const stats: any = null // Placeholder

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-success/15 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Peer Learning
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                                Find Your{' '}
                                <span className="text-gradient">Perfect Mentor</span>{' '}
                                On Campus
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg text-muted-foreground max-w-lg mb-8">
                                Connect with peer experts using our AI-powered knowledge graph.
                                Learn any skill through personalized 1-on-1 sessions with students
                                who&apos;ve mastered what you want to learn.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link href="/signup">
                                    <Button size="lg" className="w-full sm:w-auto text-base glow-primary">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="/matches">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                                        Explore Mentors
                                    </Button>
                                </Link>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-success" />
                                    <span>SRM AP Exclusive</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-warning fill-warning" />
                                    <span>4.9/5 Rating</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            {/* Interactive Graph Placeholder */}
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                {/* Animated Nodes */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50"
                                >
                                    <Brain className="w-8 h-8 text-primary" />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.15, 1],
                                        rotate: [0, -5, 5, 0],
                                    }}
                                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                                    className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-success/30 flex items-center justify-center border border-success/50"
                                >
                                    <Users className="w-6 h-6 text-success" />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                    className="absolute bottom-1/3 left-1/3 w-14 h-14 rounded-full bg-warning/30 flex items-center justify-center border border-warning/50"
                                >
                                    <Zap className="w-5 h-5 text-warning" />
                                </motion.div>

                                {/* Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                                    <motion.line
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, delay: 0.5 }}
                                        x1="140" y1="120" x2="260" y2="150"
                                        stroke="hsl(210, 100%, 55%)"
                                        strokeWidth="2"
                                        strokeOpacity="0.4"
                                        strokeDasharray="4 4"
                                    />
                                    <motion.line
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, delay: 0.8 }}
                                        x1="160" y1="130" x2="180" y2="240"
                                        stroke="hsl(142, 76%, 55%)"
                                        strokeWidth="2"
                                        strokeOpacity="0.4"
                                        strokeDasharray="4 4"
                                    />
                                </svg>

                                {/* Stats Overlay */}
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                                    <div className="text-center px-4 py-3 rounded-lg glass">
                                        <div className="text-2xl font-bold text-primary">
                                            {stats?.total_users ?? '1000+'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Students</div>
                                    </div>
                                    <div className="text-center px-4 py-3 rounded-lg glass">
                                        <div className="text-2xl font-bold text-success">
                                            {stats?.total_skills ?? '500+'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Skills</div>
                                    </div>
                                    <div className="text-center px-4 py-3 rounded-lg glass">
                                        <div className="text-2xl font-bold text-warning">
                                            {stats?.total_edges ?? '5000+'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Connections</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            How SkillSync Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our AI analyzes your learning goals and connects you with the perfect mentor
                            through our campus knowledge graph.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: Users,
                                title: 'Share Your Skills',
                                description: 'Tell us what you can teach and what you want to learn. Our AI builds your skill profile.',
                                color: 'primary',
                            },
                            {
                                step: '02',
                                icon: Brain,
                                title: 'AI Matching',
                                description: 'Our GraphRAG algorithm finds mentors through your social connections for trusted matches.',
                                color: 'success',
                            },
                            {
                                step: '03',
                                icon: Sparkles,
                                title: 'Learn & Grow',
                                description: 'Connect with your mentor, schedule sessions, and start learning. Track your progress.',
                                color: 'warning',
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="relative"
                            >
                                <div className="rounded-xl border border-border bg-card p-8 h-full hover:border-primary/30 transition-smooth">
                                    <div className="text-5xl font-bold text-muted-foreground/20 mb-4">
                                        {item.step}
                                    </div>
                                    <div
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.color === 'primary'
                                            ? 'bg-primary/20 text-primary'
                                            : item.color === 'success'
                                                ? 'bg-success/20 text-success'
                                                : 'bg-warning/20 text-warning'
                                            }`}
                                    >
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl bg-gradient-to-br from-primary/20 via-background to-success/20 border border-primary/20 p-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Join hundreds of SRM AP students already using SkillSync to learn from their peers.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="text-base glow-primary">
                                Get Started for Free
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
