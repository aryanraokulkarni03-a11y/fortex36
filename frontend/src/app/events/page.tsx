"use client";

import { motion } from "framer-motion";
import {
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Clock,
    MapPin,
    User,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
import { useData } from "@/components/DataProvider";
import BackendStatus from "@/components/BackendStatus";

const userProfile = {
    name: "Kushaan Parekh",
    avatar: "KP",
    department: "CSE"
};

// Mock data for fallback
const MOCK_EVENTS = [
    {
        id: "1",
        title: "Machine Learning Study Group",
        description: "Weekly ML concepts discussion and problem solving",
        date: "Today",
        time: "6:00 PM",
        location: "Online (Discord)",
        participants: 12,
        maxParticipants: 20,
        tags: ["Machine Learning", "Python", "Beginners Welcome"],
        host: "Priya Sharma"
    },
    {
        id: "2",
        title: "React Workshop: Building Modern UIs",
        description: "Hands-on workshop on React hooks, state management, and animations",
        date: "Tomorrow",
        time: "4:00 PM",
        location: "Seminar Hall A",
        participants: 25,
        maxParticipants: 30,
        tags: ["React", "Frontend", "Workshop"],
        host: "Kushaan Parekh"
    },
    {
        id: "3",
        title: "Hackathon Prep Session",
        description: "Team formation and project ideation for upcoming hackathon",
        date: "Saturday",
        time: "10:00 AM",
        location: "Lab 204",
        participants: 8,
        maxParticipants: 15,
        tags: ["Hackathon", "Team", "Full Stack"],
        host: "Arjun Reddy"
    },
    {
        id: "4",
        title: "Data Structures & Algorithms",
        description: "Weekly DSA practice for placement preparation",
        date: "Sunday",
        time: "11:00 AM",
        location: "Online (Google Meet)",
        participants: 45,
        maxParticipants: 50,
        tags: ["DSA", "Placements", "Competitive"],
        host: "Rohit Verma"
    },
    {
        id: "5",
        title: "Cloud Computing 101",
        description: "Introduction to AWS and cloud deployment",
        date: "Next Monday",
        time: "5:00 PM",
        location: "Online (Zoom)",
        participants: 18,
        maxParticipants: 25,
        tags: ["Cloud", "AWS", "DevOps"],
        host: "Sneha Gupta"
    }
];

export default function EventsPage() {
    const [joinedIds, setJoinedIds] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const { backendConnected, events: apiEvents, currentUserName } = useData();

    // Map API events to display format, with fallback
    const displayEvents = backendConnected && apiEvents.length > 0
        ? apiEvents.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            date: e.time.split(',')[0] || e.time, // Extract date part
            time: e.time.split(',')[1]?.trim() || e.time, // Extract time part
            location: e.location,
            participants: e.participants,
            maxParticipants: e.max_participants,
            tags: e.tags,
            host: e.host
        }))
        : MOCK_EVENTS;

    const handleJoin = (id: string) => {
        if (!joinedIds.includes(id)) {
            setJoinedIds([...joinedIds, id]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#1A1A1A] border border-primary/40 text-primary px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-lg">
                        <Calendar className="w-6 h-6" />
                        <span className="font-medium">Event joined successfully!</span>
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
                        { icon: Users, label: "Find Matches", href: "/matches", active: false },
                        { icon: MessageSquare, label: "Messages", href: "/messages", active: false },
                        { icon: Calendar, label: "Events", href: "/events", active: true },
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
                        <div>
                            <h1 className="text-2xl font-bold">Events</h1>
                            <p className="text-sm text-muted-foreground">Discover learning opportunities</p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {displayEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="glass border-border card-hover h-full overflow-hidden">
                                    <div className="h-2 bg-muted" />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-xl mb-1">{event.title}</h3>
                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-primary">
                                                <Clock className="w-4 h-4" />
                                                <span>{event.date} at {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-accent" />
                                                <span>{joinedIds.includes(event.id) ? event.participants + 1 : event.participants}/{event.maxParticipants} participants</span>
                                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${((joinedIds.includes(event.id) ? event.participants + 1 : event.participants) / event.maxParticipants) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {event.tags.map((tag: string) => (
                                                <Badge key={tag} variant="outline" className="border-primary/50 bg-transparent text-foreground text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <p className="text-sm text-muted-foreground">
                                                Hosted by <span className="text-foreground">{event.host}</span>
                                            </p>
                                            <Button
                                                variant="outline"
                                                className={`transition-all ${joinedIds.includes(event.id)
                                                    ? "bg-muted text-muted-foreground cursor-default border-border"
                                                    : "border-border text-foreground hover:bg-muted"
                                                    }`}
                                                onClick={() => handleJoin(event.id)}
                                                disabled={joinedIds.includes(event.id)}
                                            >
                                                {joinedIds.includes(event.id) ? "Joined" : "Join Event"}
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


