"use client";

import { motion } from "framer-motion";
import {
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Star,
    Medal,
    Flame,
    Crown,
    User,
    MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import ClickableAvatar from "@/components/ClickableAvatar";

const userProfile = {
    name: "Kushaan Parekh",
    avatar: "KP",
    department: "CSE"
};

const leaderboardData = [
    {
        rank: 1,
        name: "Priya Sharma",
        avatar: "PS",
        department: "CSE",
        points: 2450,
        sessions: 45,
        rating: 4.9,
        badges: 12,
        streak: 28,
        trend: "+15%"
    },
    {
        rank: 2,
        name: "Rohit Verma",
        avatar: "RV",
        department: "CSE",
        points: 2280,
        sessions: 42,
        rating: 4.8,
        badges: 10,
        streak: 21,
        trend: "+12%"
    },
    {
        rank: 3,
        name: "Sneha Gupta",
        avatar: "SG",
        department: "ECE",
        points: 2150,
        sessions: 38,
        rating: 4.7,
        badges: 9,
        streak: 18,
        trend: "+8%"
    },
    {
        rank: 4,
        name: "Arjun Reddy",
        avatar: "AR",
        department: "AI & DS",
        points: 1980,
        sessions: 35,
        rating: 4.7,
        badges: 8,
        streak: 14,
        trend: "+10%"
    },
    {
        rank: 5,
        name: "Kavya Nair",
        avatar: "KN",
        department: "IT",
        points: 1850,
        sessions: 32,
        rating: 4.6,
        badges: 7,
        streak: 12,
        trend: "+5%"
    },
    {
        rank: 6,
        name: "Kushaan Parekh",
        avatar: "KP",
        department: "CSE",
        points: 1720,
        sessions: 28,
        rating: 4.8,
        badges: 5,
        streak: 15,
        trend: "+18%",
        isCurrentUser: true
    },
    {
        rank: 7,
        name: "Amit Singh",
        avatar: "AS",
        department: "CSE",
        points: 1650,
        sessions: 26,
        rating: 4.5,
        badges: 6,
        streak: 10,
        trend: "+7%"
    },
    {
        rank: 8,
        name: "Divya Patel",
        avatar: "DP",
        department: "IT",
        points: 1580,
        sessions: 24,
        rating: 4.6,
        badges: 5,
        streak: 8,
        trend: "+9%"
    }
];

const getRankColor = (rank: number) => {
    if (rank === 1) return "from-[#F59E0B] to-[#FBBF24]"; // Gold
    if (rank === 2) return "from-[#9CA3AF] to-[#D1D5DB]"; // Silver
    if (rank === 3) return "from-[#B45309] to-[#D97706]"; // Bronze
    return "bg-muted";
};

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-[#F59E0B]" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-[#9CA3AF]" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-[#D97706]" />;
    return <span className="font-bold text-muted-foreground">#{rank}</span>;
};

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border p-6 flex flex-col z-20">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                </Link>

                <nav className="space-y-2">
                    {[
                        { icon: TrendingUp, label: "Dashboard", href: "/dashboard", active: false },
                        { icon: Users, label: "Find Matches", href: "/matches", active: false },
                        { icon: MessageSquare, label: "Messages", href: "/messages", active: false },
                        { icon: Calendar, label: "Events", href: "/events", active: false },
                        { icon: Trophy, label: "Leaderboard", href: "/leaderboard", active: true },
                        { icon: User, label: "Profile", href: "/profile", active: false }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                ? "bg-muted/20 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <DefaultAvatar size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{userProfile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userProfile.department}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8 relative z-10">
                <header className="sticky top-0 z-30 glass border-b border-border">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-[#F59E0B]" />
                                Leaderboard
                            </h1>
                            <p className="text-sm text-muted-foreground">Top contributors this month</p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {/* Top 3 Podium */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid md:grid-cols-3 gap-4 mb-8"
                    >
                        {leaderboardData.slice(0, 3).map((user, index) => (
                            <Card
                                key={user.rank}
                                className={`glass border-border card-hover overflow-hidden ${index === 0 ? "md:order-2 md:-mt-4" : index === 1 ? "md:order-1" : "md:order-3"}`}
                            >
                                <div className={`h-2 bg-gradient-to-r ${getRankColor(user.rank)}`} />
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4">
                                        {getRankIcon(user.rank)}
                                    </div>
                                    <ClickableAvatar
                                        userName={user.name}
                                        returnPath="/leaderboard"
                                        size="xl"
                                        className="mx-auto mb-4"
                                    />
                                    <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{user.department}</p>
                                    <div className="text-3xl font-bold text-primary mb-2">{user.points.toLocaleString()}</div>
                                    <p className="text-sm text-muted-foreground">points</p>
                                    <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-[#F59E0B]" />
                                            <span>{user.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Flame className="w-4 h-4 text-[#EF4444]" />
                                            <span>{user.streak} days</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Full Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Full Rankings</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y divide-border/50">
                                {leaderboardData.map((user) => (
                                    <div
                                        key={user.rank}
                                        className={`flex items-center gap-4 p-4 transition-all ${user.isCurrentUser
                                            ? "bg-primary/10"
                                            : "hover:bg-secondary/30"
                                            }`}
                                    >
                                        <div className="w-8 text-center">
                                            {getRankIcon(user.rank)}
                                        </div>
                                        <ClickableAvatar
                                            userName={user.name}
                                            returnPath="/leaderboard"
                                            size="md"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{user.name}</h3>
                                                {user.isCurrentUser && (
                                                    <Badge className="bg-muted text-primary border-border text-xs">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.department}</p>
                                        </div>
                                        <div className="hidden md:flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="font-bold">{user.sessions}</p>
                                                <p className="text-xs text-muted-foreground">Sessions</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-[#F59E0B]" />
                                                    {user.rating}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Rating</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold flex items-center gap-1">
                                                    <Flame className="w-4 h-4 text-[#EF4444]" />
                                                    {user.streak}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Streak</p>
                                            </div>
                                            <div className="text-center">
                                                <Badge variant="secondary" className="bg-muted text-foreground border-0">
                                                    {user.trend}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-primary">{user.points.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">points</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
