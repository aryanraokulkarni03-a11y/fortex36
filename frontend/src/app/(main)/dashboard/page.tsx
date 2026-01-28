'use client'

import { motion } from 'framer-motion'
import { Search, BookOpen, Users, Star, TrendingUp, Calendar, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGraphStats } from '@/lib/hooks/use-matches'
import { StatCardSkeleton } from '@/components/ui/skeleton'
import { StaggerContainer, StaggerItem, StaggerReveal } from '@/components/animations/stagger-reveal'
import { AnimatedCounter } from '@/components/animations/animated-counter'

// Demo data (in production, fetch from API)
const recentMatches = [
    { id: '1', name: 'Rahul Kumar', skill: 'Machine Learning', status: 'pending', score: 92 },
    { id: '2', name: 'Priya Singh', skill: 'React', status: 'accepted', score: 88 },
    { id: '3', name: 'Amit Patel', skill: 'Python', status: 'completed', score: 85 },
]

const mySkills = {
    teaching: ['JavaScript', 'React', 'Node.js'],
    learning: ['Machine Learning', 'Python', 'Data Science'],
}

// Stat card configuration
const statConfig = [
    { key: 'users', label: 'Total Students', icon: Users, color: 'primary', field: 'total_users' },
    { key: 'skills', label: 'Skills Available', icon: BookOpen, color: 'success', field: 'total_skills' },
    { key: 'connections', label: 'Connections', icon: TrendingUp, color: 'warning', field: 'total_edges' },
    { key: 'trust', label: 'Trust Score', icon: Star, color: 'danger', staticValue: 85 },
]

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading } = useGraphStats()

    return (
        <div className="min-h-screen bg-background grain">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <StaggerReveal className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Zap className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Welcome back! 👋
                                </h1>
                                <p className="text-muted-foreground">
                                    Here&apos;s what&apos;s happening with your learning journey.
                                </p>
                            </div>
                        </div>
                    </StaggerReveal>

                    {/* Stats Grid */}
                    <StaggerContainer
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        staggerDelay={0.1}
                    >
                        {statsLoading ? (
                            <>
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                            </>
                        ) : (
                            statConfig.map((config) => {
                                const IconComponent = config.icon
                                const value = config.staticValue ?? (stats?.[config.field as keyof typeof stats] ?? 0)

                                return (
                                    <StaggerItem key={config.key}>
                                        <Card className="interactive-card hover:glow-primary">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        className={`w-12 h-12 rounded-xl bg-${config.color}/20 flex items-center justify-center`}
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        <IconComponent className={`w-6 h-6 text-${config.color}`} />
                                                    </motion.div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">{config.label}</p>
                                                        <p className="text-2xl font-bold text-foreground">
                                                            <AnimatedCounter
                                                                value={value as number}
                                                                duration={1.5}
                                                                delay={0.3}
                                                            />
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </StaggerItem>
                                )
                            })
                        )}
                    </StaggerContainer>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Matches */}
                        <StaggerReveal delay={0.3} className="lg:col-span-2">
                            <Card className="glass-card">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Recent Matches</CardTitle>
                                    <Link href="/matches">
                                        <Button variant="ghost" size="sm" className="hover-lift">
                                            View All
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentMatches.map((match, idx) => (
                                            <motion.div
                                                key={match.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + idx * 0.1 }}
                                                whileHover={{ scale: 1.01, x: 4 }}
                                                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="ring-2 ring-border">
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-success text-white">
                                                            {match.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-foreground">{match.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Learning: {match.skill}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        variant={
                                                            match.status === 'accepted'
                                                                ? 'success'
                                                                : match.status === 'completed'
                                                                    ? 'default'
                                                                    : 'warning'
                                                        }
                                                    >
                                                        {match.status}
                                                    </Badge>
                                                    <motion.span
                                                        className="text-lg font-bold text-primary"
                                                        animate={{ scale: [1, 1.05, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        {match.score}%
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerReveal>

                        {/* My Skills */}
                        <StaggerReveal delay={0.4}>
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="text-lg">My Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Teaching */}
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">
                                            I can teach
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {mySkills.teaching.map((skill, idx) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <Badge variant="success" className="hover:glow-success">
                                                        {skill}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Learning */}
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">
                                            I want to learn
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {mySkills.learning.map((skill, idx) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <Badge variant="default" className="hover:glow-primary">
                                                        {skill}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button className="w-full hover-lift" variant="outline">
                                        Edit Skills
                                    </Button>
                                </CardContent>
                            </Card>
                        </StaggerReveal>
                    </div>

                    {/* Quick Actions */}
                    <StaggerReveal delay={0.5} className="mt-8">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.1}>
                            <StaggerItem>
                                <Link href="/matches">
                                    <Card className="p-6 interactive-card hover:border-primary/50 hover:glow-primary cursor-pointer group">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3"
                                        >
                                            <Search className="w-6 h-6 text-primary" />
                                        </motion.div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            Find Mentors
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Search for peer mentors</p>
                                    </Card>
                                </Link>
                            </StaggerItem>

                            <StaggerItem>
                                <Link href="/sessions">
                                    <Card className="p-6 interactive-card hover:border-success/50 hover:glow-success cursor-pointer group">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-3"
                                        >
                                            <Calendar className="w-6 h-6 text-success" />
                                        </motion.div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-success transition-colors">
                                            My Sessions
                                        </h3>
                                        <p className="text-sm text-muted-foreground">View scheduled sessions</p>
                                    </Card>
                                </Link>
                            </StaggerItem>

                            <StaggerItem>
                                <Link href="/profile">
                                    <Card className="p-6 interactive-card hover:border-warning/50 hover:glow-warning cursor-pointer group">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center mb-3"
                                        >
                                            <Users className="w-6 h-6 text-warning" />
                                        </motion.div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-warning transition-colors">
                                            My Profile
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Update your profile</p>
                                    </Card>
                                </Link>
                            </StaggerItem>

                            <StaggerItem>
                                <Link href="/events">
                                    <Card className="p-6 interactive-card hover:border-danger/50 cursor-pointer group">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center mb-3"
                                        >
                                            <Star className="w-6 h-6 text-danger" />
                                        </motion.div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-danger transition-colors">
                                            Events
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Join campus events</p>
                                    </Card>
                                </Link>
                            </StaggerItem>
                        </StaggerContainer>
                    </StaggerReveal>
                </div>
            </main>

            <Footer />
        </div>
    )
}
