"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";
import {
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Star,
    User,
    MessageSquare,
    ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";
import { getUserByName } from "@/lib/users";
import { useData } from "@/components/DataProvider";
import BackendStatus from "@/components/BackendStatus";

const currentUserProfile = {
    name: "Kushaan Parekh",
    avatar: "KP",
    department: "CSE"
};

// Helper functions for skill levels
const getLevelFromPercentage = (percentage: number): string => {
    if (percentage <= 20) return "Beginner";
    if (percentage <= 40) return "Foundational";
    if (percentage <= 60) return "Intermediate";
    if (percentage <= 80) return "Advanced";
    return "Expert";
};

function UserProfilePageContent({ params: _params }: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentUserName } = useData();

    const returnPath = searchParams.get('returnPath') || '/dashboard';
    const name = searchParams.get('name') || 'Unknown User';
    const department = searchParams.get('department') || 'Unknown';
    const year = searchParams.get('year') || '';
    const skillsHaveStr = searchParams.get('skillsHave') || '';
    const skillsWantStr = searchParams.get('skillsWant') || '';
    const rating = parseFloat(searchParams.get('rating') || '0');
    const sessions = parseInt(searchParams.get('sessions') || '0');
    const matchScore = parseInt(searchParams.get('matchScore') || '0');

    const skillsHave = skillsHaveStr ? skillsHaveStr.split(',').map(s => ({ name: s.trim(), level: 75 })) : [];
    const skillsWant = skillsWantStr ? skillsWantStr.split(',').map(s => ({ name: s.trim(), level: 35 })) : [];

    // Generate skill DNA data from skills
    const skillDNAData = [
        { skill: "Teaching", A: skillsHave.length > 0 ? 80 : 30 },
        { skill: "Learning", A: skillsWant.length > 0 ? 70 : 30 },
        { skill: "Sessions", A: Math.min(sessions * 2, 100) },
        { skill: "Rating", A: rating * 20 },
        { skill: "Match", A: matchScore },
        { skill: "Active", A: 65 }
    ];

    const handleBack = () => {
        router.push(returnPath);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Sidebar - No active item */}
            <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border p-6 flex flex-col z-20">
                <div className="flex items-center gap-2 mb-8 cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                </div>

                <nav className="space-y-2">
                    {[
                        { icon: TrendingUp, label: "Dashboard", href: "/dashboard" },
                        { icon: Users, label: "Find Matches", href: "/matches" },
                        { icon: MessageSquare, label: "Messages", href: "/messages" },
                        { icon: Calendar, label: "Events", href: "/events" },
                        { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
                        { icon: User, label: "Profile", href: "/profile" }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
                            <p className="font-medium truncate">{currentUserName || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">CSE</p>
                        </div>
                    </div>
                    <BackendStatus className="mt-2" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8 relative z-10">
                <header className="sticky top-0 z-30 glass border-b border-border">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-foreground hover:bg-muted/20"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">{name}&apos;s Profile</h1>
                                <p className="text-sm text-muted-foreground">Viewing profile</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Card className="glass border-border">
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <DefaultAvatar size="xl" className="mx-auto mb-4" />
                                        <h2 className="text-2xl font-bold">{name}</h2>
                                        <p className="text-muted-foreground">{department}{year && ` • ${year}`}</p>
                                    </div>


                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{rating || '—'}</p>
                                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                                <Star className="w-3 h-3 text-[#F59E0B]" />Rating
                                            </p>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{sessions || '—'}</p>
                                            <p className="text-xs text-muted-foreground">Sessions</p>
                                        </div>
                                        {matchScore > 0 && (
                                            <>
                                                <div className="text-center p-3 rounded-xl bg-secondary/30 col-span-2">
                                                    <p className="text-2xl font-bold text-primary">{matchScore}%</p>
                                                    <p className="text-xs text-muted-foreground">Match Score</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Message Button */}
                                    <Button
                                        variant="outline"
                                        className="w-full mt-6 border-border text-foreground hover:bg-muted/20"
                                        onClick={() => {
                                            const user = getUserByName(name);
                                            if (user) {
                                                const params = new URLSearchParams({
                                                    userId: user.id.toString(),
                                                    userName: user.name,
                                                    userAvatar: user.avatar,
                                                });
                                                router.push(`/messages?${params.toString()}`);
                                            }
                                        }}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Message
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            {/* Skill DNA Visualization */}
                            <Card className="glass border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-accent" />
                                        Skill DNA
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={skillDNAData}>
                                                <PolarGrid stroke="#2d4a6f" />
                                                <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <Radar
                                                    name="Skills"
                                                    dataKey="A"
                                                    stroke="#F4D06F"
                                                    fill="#F4D06F"
                                                    fillOpacity={0.3}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills They Can Teach */}
                            {skillsHave.length > 0 && (
                                <Card className="glass border-border">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Skills They Can Teach</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {skillsHave.map((skill) => (
                                            <div key={skill.name} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="secondary" className="bg-muted text-foreground border-0">
                                                        {skill.name}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">{getLevelFromPercentage(skill.level)}</span>
                                                </div>
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.level}%` }}
                                                        transition={{ duration: 0.5 }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Skills They Want to Learn */}
                            {skillsWant.length > 0 && (
                                <Card className="glass border-border">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Skills They Want to Learn</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {skillsWant.map((skill) => (
                                            <div key={skill.name} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="secondary" className="bg-muted text-foreground border-0">
                                                        {skill.name}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">{getLevelFromPercentage(skill.level)}</span>
                                                </div>
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.level}%` }}
                                                        transition={{ duration: 0.5 }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function UserProfilePage(props: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading profile...</div>}>
            <UserProfilePageContent {...props} />
        </Suspense>
    );
}
