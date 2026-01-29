"use client";

import { motion } from "framer-motion";
import {
    Search,
    Bell,
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Star,
    Network,
    User,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultAvatar from "@/components/DefaultAvatar";
import ClickableAvatar from "@/components/ClickableAvatar";
import { useData } from "@/components/DataProvider";
import BackendStatus from "@/components/BackendStatus";

const userProfile = {
    name: "Kushaan Parekh",
    avatar: "KP",
    department: "CSE"
};

// Mock data for fallback
const MOCK_MATCHES = [
    {
        id: "1",
        name: "Priya Sharma",
        avatar: "PS",
        department: "CSE",
        year: "3rd Year",
        matchScore: 94,
        skillsHave: ["Machine Learning", "Python", "TensorFlow"],
        skillsWant: ["React", "UI/UX"],
        connectionDegree: 2,
        mutualConnection: "Rahul Kumar",
        rating: 4.9,
        sessions: 28
    },
    {
        id: "2",
        name: "Arjun Reddy",
        avatar: "AR",
        department: "AI & DS",
        year: "2nd Year",
        matchScore: 87,
        skillsHave: ["Python", "Data Science", "SQL"],
        skillsWant: ["TypeScript", "Backend"],
        connectionDegree: 1,
        mutualConnection: null,
        rating: 4.7,
        sessions: 15
    },
    {
        id: "3",
        name: "Sneha Gupta",
        avatar: "SG",
        department: "ECE",
        year: "3rd Year",
        matchScore: 82,
        skillsHave: ["Deep Learning", "Computer Vision"],
        skillsWant: ["Web Dev", "React"],
        connectionDegree: 3,
        mutualConnection: "Kavya + 2 others",
        rating: 4.6,
        sessions: 22
    },
    {
        id: "4",
        name: "Rohit Verma",
        avatar: "RV",
        department: "CSE",
        year: "4th Year",
        matchScore: 79,
        skillsHave: ["Java", "Spring Boot", "Microservices"],
        skillsWant: ["React", "Frontend"],
        connectionDegree: 2,
        mutualConnection: "Amit Singh",
        rating: 4.8,
        sessions: 35
    },
    {
        id: "5",
        name: "Kavya Nair",
        avatar: "KN",
        department: "IT",
        year: "2nd Year",
        matchScore: 75,
        skillsHave: ["Python", "Django", "PostgreSQL"],
        skillsWant: ["Machine Learning", "AI"],
        connectionDegree: 1,
        mutualConnection: null,
        rating: 4.5,
        sessions: 10
    },
    {
        id: "6",
        name: "Vikram Patel",
        avatar: "VP",
        department: "CSE",
        year: "3rd Year",
        matchScore: 71,
        skillsHave: ["Flutter", "Dart", "Firebase"],
        skillsWant: ["React Native", "Swift"],
        connectionDegree: 2,
        mutualConnection: "Priya Sharma",
        rating: 4.4,
        sessions: 18
    },
    {
        id: "7",
        name: "Ananya Das",
        avatar: "AD",
        department: "AI & DS",
        year: "4th Year",
        matchScore: 68,
        skillsHave: ["NLP", "PyTorch", "Hugging Face"],
        skillsWant: ["Web Dev", "JavaScript"],
        connectionDegree: 3,
        mutualConnection: "Arjun + 1 other",
        rating: 4.7,
        sessions: 42
    },
    {
        id: "8",
        name: "Rahul Kumar",
        avatar: "RK",
        department: "ECE",
        year: "2nd Year",
        matchScore: 65,
        skillsHave: ["C++", "Embedded Systems", "Arduino"],
        skillsWant: ["Python", "IoT"],
        connectionDegree: 1,
        mutualConnection: null,
        rating: 4.3,
        sessions: 8
    }
];

interface DisplayMatch {
    id: string;
    name: string;
    avatar: string;
    department: string;
    year: string;
    matchScore: number;
    skillsHave: string[];
    skillsWant: string[];
    connectionDegree: number;
    mutualConnection: string | null;
    rating: number;
    sessions: number;
}

export default function MatchesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [connectedIds, setConnectedIds] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [displayMatches, setDisplayMatches] = useState<DisplayMatch[]>(MOCK_MATCHES);
    const [isSearching, setIsSearching] = useState(false);

    const { backendConnected, findMatches, sendConnection, currentUserName, currentUserId } = useData();

    // Fetch matches when component loads or search changes
    useEffect(() => {
        const fetchMatches = async () => {
            if (backendConnected && searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const results = await findMatches(searchQuery.trim());
                    if (results && results.length > 0) {
                        const mapped = results.map(m => ({
                            id: m.user_id,
                            name: m.name,
                            avatar: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                            department: m.branch,
                            year: `${m.year}${m.year === 1 ? 'st' : m.year === 2 ? 'nd' : m.year === 3 ? 'rd' : 'th'} Year`,
                            matchScore: m.match_score,
                            skillsHave: ["Python", "Machine Learning"], // Backend doesn't return skills yet
                            skillsWant: ["React", "Web Dev"], // Backend doesn't return skills yet
                            connectionDegree: m.connection_degree,
                            mutualConnection: m.connection_path.length > 2 ? m.connection_path[1] : null,
                            rating: 4.5 + (m.proficiency / 20), // Derived
                            sessions: Math.floor(m.match_score / 3) // Derived
                        }));
                        setDisplayMatches(mapped);
                    }
                } catch {
                    console.warn('Failed to fetch matches, using mock data');
                }
                setIsSearching(false);
            } else if (!searchQuery.trim()) {
                setDisplayMatches(MOCK_MATCHES);
            }
        };

        const debounce = setTimeout(fetchMatches, 500);
        return () => clearTimeout(debounce);
    }, [searchQuery, backendConnected, findMatches]);

    const handleConnect = async (id: string, matchName: string) => {
        if (!connectedIds.includes(id)) {
            // Try to send real connection request
            if (backendConnected) {
                const requestId = await sendConnection(id, searchQuery || 'General');
                if (requestId) {
                    console.log(`Connection request sent: ${requestId}`);
                }
            }
            setConnectedIds([...connectedIds, id]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleMessage = (match: DisplayMatch) => {
        const params = new URLSearchParams({
            userId: match.id,
            userName: match.name,
            userAvatar: match.avatar,
        });
        router.push(`/messages?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#1A1A1A] border border-primary/40 text-primary px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-lg">
                        <Sparkles className="w-6 h-6" />
                        <span className="font-medium">Request sent successfully!</span>
                    </div>
                </div>
            )}
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border p-6 flex flex-col z-20">
                <div className="flex items-center gap-2 mb-8 cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                </div>

                <nav className="space-y-2">
                    {[
                        { icon: TrendingUp, label: "Dashboard", href: "/dashboard", active: false },
                        { icon: Users, label: "Find Matches", href: "/matches", active: true },
                        { icon: MessageSquare, label: "Messages", href: "/messages", active: false },
                        { icon: Calendar, label: "Events", href: "/events", active: false },
                        { icon: Trophy, label: "Leaderboard", href: "/leaderboard", active: false },
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
                            <p className="font-medium truncate">{currentUserName || userProfile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userProfile.department}</p>
                        </div>
                    </div>
                    <BackendStatus className="mt-2" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <header className="sticky top-0 z-30 glass border-b border-border">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by skill (e.g., Python, React, Machine Learning)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-5 bg-secondary/50 border-border focus:border-primary"
                                />
                                {isSearching && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 ml-6">
                            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-muted rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6"
                    >
                        <h1 className="text-3xl font-bold mb-2">Find Your Match</h1>
                        <p className="text-muted-foreground">
                            {backendConnected
                                ? "AI-powered recommendations based on your skills"
                                : "Showing demo matches (backend offline)"}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayMatches.map((match, index) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="glass border-border card-hover h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <ClickableAvatar
                                                    userName={match.name}
                                                    returnPath="/matches"
                                                    size="md"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-lg">{match.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{match.department} • {match.year}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-transparent text-primary border border-primary/40">
                                                {match.matchScore}%
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-[#F59E0B]" />
                                                <span>{match.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                <span>{match.sessions} sessions</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                                            <Network className="w-4 h-4 text-primary" />
                                            <span>
                                                {match.connectionDegree === 1 ? "1st" : match.connectionDegree === 2 ? "2nd" : "3rd"} degree
                                                {match.mutualConnection && ` via ${match.mutualConnection}`}
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Can teach you</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.skillsHave.map((skill: string) => (
                                                        <Badge key={skill} variant="outline" className="border-primary/50 bg-transparent text-muted-foreground text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Wants to learn</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.skillsWant.map((skill: string) => (
                                                        <Badge key={skill} variant="outline" className="border-primary/50 bg-transparent text-muted-foreground text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className={`flex-1 transition-all ${connectedIds.includes(match.id)
                                                    ? "bg-muted text-muted-foreground cursor-default border-border"
                                                    : "border-border text-foreground hover:bg-muted"
                                                    }`}
                                                onClick={() => handleConnect(match.id, match.name)}
                                                disabled={connectedIds.includes(match.id)}
                                            >
                                                {connectedIds.includes(match.id) ? "Request Sent" : "Connect"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-border text-foreground hover:bg-muted"
                                                onClick={() => handleMessage(match)}
                                            >
                                                Message
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}


