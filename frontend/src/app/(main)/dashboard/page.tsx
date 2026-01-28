'use client'

import { motion } from 'framer-motion'
import { Search, BookOpen, Users, Star, TrendingUp, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGraphStats } from '@/lib/hooks/use-matches'
import { StatCardSkeleton } from '@/components/ui/skeleton'

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

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading } = useGraphStats()

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Welcome back! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Here&apos;s what&apos;s happening with your learning journey.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statsLoading ? (
                            <>
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Total Students</p>
                                                    <p className="text-2xl font-bold text-foreground">
                                                        {stats?.total_users ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                                                    <BookOpen className="w-6 h-6 text-success" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Skills Available</p>
                                                    <p className="text-2xl font-bold text-foreground">
                                                        {stats?.total_skills ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                                                    <TrendingUp className="w-6 h-6 text-warning" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Connections</p>
                                                    <p className="text-2xl font-bold text-foreground">
                                                        {stats?.total_edges ?? 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-danger/20 flex items-center justify-center">
                                                    <Star className="w-6 h-6 text-danger" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Trust Score</p>
                                                    <p className="text-2xl font-bold text-foreground">85</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Matches */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-2"
                        >
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Recent Matches</CardTitle>
                                    <Link href="/matches">
                                        <Button variant="ghost" size="sm">
                                            View All
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentMatches.map((match) => (
                                            <div
                                                key={match.id}
                                                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>
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
                                                    <span className="text-lg font-bold text-primary">{match.score}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* My Skills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card>
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
                                            {mySkills.teaching.map((skill) => (
                                                <Badge key={skill} variant="success">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Learning */}
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">
                                            I want to learn
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {mySkills.learning.map((skill) => (
                                                <Badge key={skill} variant="default">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Button className="w-full" variant="outline">
                                        Edit Skills
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8"
                    >
                        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/matches">
                                <Card className="p-6 hover:border-primary/50 hover:glow-primary cursor-pointer transition-smooth">
                                    <Search className="w-8 h-8 text-primary mb-3" />
                                    <h3 className="font-semibold text-foreground mb-1">Find Mentors</h3>
                                    <p className="text-sm text-muted-foreground">Search for peer mentors</p>
                                </Card>
                            </Link>

                            <Link href="/sessions">
                                <Card className="p-6 hover:border-success/50 hover:glow-success cursor-pointer transition-smooth">
                                    <Calendar className="w-8 h-8 text-success mb-3" />
                                    <h3 className="font-semibold text-foreground mb-1">My Sessions</h3>
                                    <p className="text-sm text-muted-foreground">View scheduled sessions</p>
                                </Card>
                            </Link>

                            <Link href="/profile">
                                <Card className="p-6 hover:border-warning/50 cursor-pointer transition-smooth">
                                    <Users className="w-8 h-8 text-warning mb-3" />
                                    <h3 className="font-semibold text-foreground mb-1">My Profile</h3>
                                    <p className="text-sm text-muted-foreground">Update your profile</p>
                                </Card>
                            </Link>

                            <Link href="/events">
                                <Card className="p-6 hover:border-danger/50 cursor-pointer transition-smooth">
                                    <Star className="w-8 h-8 text-danger mb-3" />
                                    <h3 className="font-semibold text-foreground mb-1">Events</h3>
                                    <p className="text-sm text-muted-foreground">Join campus events</p>
                                </Card>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
