"use client";

import { motion } from "framer-motion";
import {
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Star,
    Edit2,
    Plus,
    X,
    Mail,
    GraduationCap,
    User,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

const userProfile = {
    name: "Kushaan Parekh",
    email: "kushaan_parekh@srmap.edu.in",
    avatar: "KP",
    department: "CSE",
    year: "2nd Year",
    bio: "Full-stack developer passionate about building beautiful UIs. Love teaching React and learning ML!",
    joinDate: "September 2025",
    stats: {
        rating: 4.8,
        sessions: 28,
        connections: 23,
        badges: 5
    }
};

const initialSkillsHave = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "CSS", level: 88 },
    { name: "Git", level: 80 }
];

const initialSkillsWant = [
    { name: "Machine Learning", level: 30 },
    { name: "Python", level: 45 },
    { name: "TensorFlow", level: 20 },
    { name: "Data Science", level: 35 }
];

const skillDNAData = [
    { skill: "Frontend", A: 90 },
    { skill: "Backend", A: 70 },
    { skill: "ML/AI", A: 35 },
    { skill: "Database", A: 60 },
    { skill: "DevOps", A: 45 },
    { skill: "Mobile", A: 55 }
];

const badges = [
    { name: "React Pro", icon: "⚛️", description: "Completed 10+ React sessions" },
    { name: "Helpful Mentor", icon: "🌟", description: "5+ positive reviews" },
    { name: "Quick Learner", icon: "🚀", description: "Learned 3 skills in a month" },
    { name: "Streak Master", icon: "🔥", description: "7-day learning streak" },
    { name: "Community Builder", icon: "🤝", description: "Connected with 20+ peers" }
];

const recentSessions = [
    { with: "Priya Sharma", skill: "Machine Learning", date: "2 days ago", rating: 5 },
    { with: "Arjun Reddy", skill: "React Hooks", date: "5 days ago", rating: 5 },
    { with: "Sneha Gupta", skill: "TypeScript", date: "1 week ago", rating: 4 }
];

// Helper functions for skill levels
const getLevelFromPercentage = (percentage: number): string => {
    if (percentage <= 20) return "Beginner";
    if (percentage <= 40) return "Foundational";
    if (percentage <= 60) return "Intermediate";
    if (percentage <= 80) return "Advanced";
    return "Expert";
};

const getPercentageFromLevel = (level: string): number => {
    switch (level) {
        case "Beginner": return 10;
        case "Foundational": return 30;
        case "Intermediate": return 50;
        case "Advanced": return 70;
        case "Expert": return 90;
        default: return 50;
    }
};

const skillLevels = ["Beginner", "Foundational", "Intermediate", "Advanced", "Expert"];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [skillsHave, setSkillsHave] = useState(initialSkillsHave);
    const [skillsWant, setSkillsWant] = useState(initialSkillsWant);
    const [markedForDeletionHave, setMarkedForDeletionHave] = useState<string[]>([]);
    const [markedForDeletionWant, setMarkedForDeletionWant] = useState<string[]>([]);

    // Add skill modal state
    const [showAddHaveModal, setShowAddHaveModal] = useState(false);
    const [showAddWantModal, setShowAddWantModal] = useState(false);
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState("Intermediate");

    const handleMarkForDeletion = (skillName: string, type: "have" | "want") => {
        if (type === "have") {
            if (markedForDeletionHave.includes(skillName)) {
                setMarkedForDeletionHave(markedForDeletionHave.filter(s => s !== skillName));
            } else {
                setMarkedForDeletionHave([...markedForDeletionHave, skillName]);
            }
        } else {
            if (markedForDeletionWant.includes(skillName)) {
                setMarkedForDeletionWant(markedForDeletionWant.filter(s => s !== skillName));
            } else {
                setMarkedForDeletionWant([...markedForDeletionWant, skillName]);
            }
        }
    };

    const handleSaveChanges = () => {
        // Remove marked skills
        setSkillsHave(skillsHave.filter(s => !markedForDeletionHave.includes(s.name)));
        setSkillsWant(skillsWant.filter(s => !markedForDeletionWant.includes(s.name)));
        // Clear marks
        setMarkedForDeletionHave([]);
        setMarkedForDeletionWant([]);
        setIsEditing(false);
    };

    const handleAddSkill = (type: "have" | "want") => {
        const level = getPercentageFromLevel(newSkillLevel);
        if (newSkillName && newSkillLevel) {
            if (type === "have") {
                setSkillsHave([...skillsHave, { name: newSkillName, level }]);
                setShowAddHaveModal(false);
            } else {
                setSkillsWant([...skillsWant, { name: newSkillName, level }]);
                setShowAddWantModal(false);
            }
            setNewSkillName("");
            setNewSkillLevel("Intermediate");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Add Skill Modal - Have */}
            {showAddHaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4">Add Skill I Can Teach</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Skill Name</label>
                                <Input
                                    placeholder="Enter skill name..."
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    className="bg-secondary/50 border-border"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Proficiency Level</label>
                                <select
                                    value={newSkillLevel}
                                    onChange={(e) => setNewSkillLevel(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {skillLevels.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-border"
                                    onClick={() => {
                                        setShowAddHaveModal(false);
                                        setNewSkillName("");
                                        setNewSkillLevel("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-muted hover:bg-muted/80 text-white border-0"
                                    onClick={() => handleAddSkill("have")}
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Skill Modal - Want */}
            {showAddWantModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4">Add Skill I Want to Learn</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Skill Name</label>
                                <Input
                                    placeholder="Enter skill name..."
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    className="bg-secondary/50 border-border"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block">Current Level</label>
                                <select
                                    value={newSkillLevel}
                                    onChange={(e) => setNewSkillLevel(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {skillLevels.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-border"
                                    onClick={() => {
                                        setShowAddWantModal(false);
                                        setNewSkillName("");
                                        setNewSkillLevel("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-muted hover:bg-muted/80 text-white border-0"
                                    onClick={() => handleAddSkill("want")}
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

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
                        { icon: Trophy, label: "Leaderboard", href: "/leaderboard", active: false },
                        { icon: User, label: "Profile", href: "/profile", active: true }
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
                            <h1 className="text-2xl font-bold">My Profile</h1>
                            <p className="text-sm text-muted-foreground">Manage your skills and preferences</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-primary/30 text-foreground hover:bg-muted/20"
                            onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
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
                                        <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                                        <p className="text-muted-foreground">{userProfile.department} • {userProfile.year}</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{userProfile.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Joined {userProfile.joinDate}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm leading-relaxed text-muted-foreground mb-8">{userProfile.bio}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{userProfile.stats.rating}</p>
                                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                                <Star className="w-3 h-3 text-[#F59E0B]" /> Rating
                                            </p>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{userProfile.stats.sessions}</p>
                                            <p className="text-xs text-muted-foreground">Sessions</p>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{userProfile.stats.connections}</p>
                                            <p className="text-xs text-muted-foreground">Connections</p>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-secondary/30">
                                            <p className="text-2xl font-bold">{userProfile.stats.badges}</p>
                                            <p className="text-xs text-muted-foreground">Badges</p>
                                        </div>
                                    </div>
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

                            {/* Skills I Have */}
                            <Card className="glass border-border">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Skills I Can Teach</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-primary/30 text-primary"
                                        onClick={() => setShowAddHaveModal(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Skill
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {skillsHave.map((skill) => (
                                        <div key={skill.name} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="bg-muted text-foreground border-0">
                                                        {skill.name}
                                                    </Badge>
                                                    {isEditing && (
                                                        <button
                                                            className={`transition-colors ${markedForDeletionHave.includes(skill.name)
                                                                ? "text-red-500"
                                                                : "text-muted-foreground hover:text-red-400"
                                                                }`}
                                                            onClick={() => handleMarkForDeletion(skill.name, "have")}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="text-sm text-muted-foreground">{getLevelFromPercentage(skill.level)}</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`h-full ${markedForDeletionHave.includes(skill.name)
                                                        ? "bg-red-500"
                                                        : "bg-primary"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Skills I Want */}
                            <Card className="glass border-border">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Skills I Want to Learn</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-primary/30 text-primary"
                                        onClick={() => setShowAddWantModal(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Skill
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {skillsWant.map((skill) => (
                                        <div key={skill.name} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="bg-muted text-foreground border-0">
                                                        {skill.name}
                                                    </Badge>
                                                    {isEditing && (
                                                        <button
                                                            className={`transition-colors ${markedForDeletionWant.includes(skill.name)
                                                                ? "text-red-500"
                                                                : "text-muted-foreground hover:text-red-400"
                                                                }`}
                                                            onClick={() => handleMarkForDeletion(skill.name, "want")}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="text-sm text-muted-foreground">{getLevelFromPercentage(skill.level)}</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.level}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`h-full ${markedForDeletionWant.includes(skill.name)
                                                        ? "bg-red-500"
                                                        : "bg-primary"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Badges and Recent Sessions */}
                    <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        {/* Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="glass border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-[#F59E0B]" />
                                        Badges Earned
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-4">
                                        {badges.map((badge) => (
                                            <div
                                                key={badge.name}
                                                className="text-center p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer group"
                                                title={badge.description}
                                            >
                                                <div className="text-3xl mb-1">{badge.icon}</div>
                                                <p className="text-xs text-muted-foreground group-hover:text-foreground truncate">
                                                    {badge.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Recent Sessions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="glass border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        Recent Sessions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {recentSessions.map((session, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
                                        >
                                            <div>
                                                <p className="font-medium">{session.skill}</p>
                                                <p className="text-sm text-muted-foreground">with {session.with}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(session.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{session.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
