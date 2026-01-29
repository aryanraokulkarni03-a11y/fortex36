"use client";

import { motion } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Sparkles,
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Star,
  Network,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
import ClickableAvatar from "@/components/ClickableAvatar";
import { useData } from "@/components/DataProvider";
import { useMatches, useCurrentUser } from "@/lib/hooks";
import BackendStatus from "@/components/BackendStatus";

// Mock data for fallback (when backend is offline)
const MOCK_PROFILE = {
  name: "Kushaan Parekh",
  email: "kushaan_parekh@srmap.edu.in",
  year: "2nd Year",
  department: "CSE",
  avatar: "KP",
  skillsHave: ["React", "TypeScript", "Node.js", "CSS", "Git"],
  skillsWant: ["Machine Learning", "Python", "TensorFlow", "Data Science"],
  matchScore: 94,
  connectionsCount: 23,
  sessionsCompleted: 12,
  rating: 4.8
};

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
  }
];

const MOCK_EVENTS = [
  {
    id: "1",
    title: "ML Study Group",
    date: "Today, 6 PM",
    participants: 12,
    tags: ["Machine Learning", "Python"]
  },
  {
    id: "2",
    title: "React Workshop",
    date: "Tomorrow, 4 PM",
    participants: 25,
    tags: ["React", "Frontend"]
  },
  {
    id: "3",
    title: "Hackathon Prep",
    date: "Sat, 10 AM",
    participants: 8,
    tags: ["Full Stack", "Team"]
  }
];

const activityFeed = [
  { user: "Rahul", action: "completed a session on React", time: "2 min ago" },
  { user: "Kavya", action: "earned 'Python Expert' badge", time: "15 min ago" },
  { user: "Arjun", action: "joined ML Study Group", time: "1 hour ago" }
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { backendConnected, events, currentUserId } = useData();

  // Fetch real user profile
  const { data: userData } = useCurrentUser();

  // Fetch matches - searching for first 'want' skill or default to 'Python'
  const skillToSearch = userData?.skills?.find(s => s.is_learning)?.skill_name || 'Python';
  const { data: matchesData } = useMatches(currentUserId, skillToSearch);

  // Computed data with fallback
  const userProfile = backendConnected && userData ? {
    name: userData.name,
    email: userData.email,
    year: `${userData.year}${userData.year === 1 ? 'st' : userData.year === 2 ? 'nd' : userData.year === 3 ? 'rd' : 'th'} Year`,
    department: userData.branch,
    avatar: userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    skillsHave: (userData.skills || []).filter(s => s.is_teaching).map(s => s.skill_name),
    skillsWant: (userData.skills || []).filter(s => s.is_learning).map(s => s.skill_name),
    matchScore: MOCK_PROFILE.matchScore, // Not in API yet
    connectionsCount: MOCK_PROFILE.connectionsCount, // Not in API yet
    sessionsCompleted: MOCK_PROFILE.sessionsCompleted, // Not in API yet
    rating: MOCK_PROFILE.rating // Not in API yet
  } : MOCK_PROFILE;

  const displayEvents = backendConnected && events.length > 0 ? events.map(e => ({
    id: e.id,
    title: e.title,
    date: e.time, // Map 'time' to 'date' for UI consistency
    participants: e.participants,
    tags: e.tags
  })) : MOCK_EVENTS;

  const displayMatches = backendConnected && matchesData && matchesData.length > 0 ? matchesData.map(m => ({
    id: m.user_id,
    name: m.name,
    avatar: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    department: m.branch,
    year: `${m.year}${m.year === 1 ? 'st' : m.year === 2 ? 'nd' : m.year === 3 ? 'rd' : 'th'} Year`,
    matchScore: m.match_score,
    skillsHave: ["Python", "Machine Learning"], // Backend match doesn't return skills list yet, fallback
    skillsWant: ["React", "Web Dev"], // Backend match doesn't return skills list yet, fallback
    connectionDegree: m.connection_degree,
    mutualConnection: m.connection_path.length > 2 ? m.connection_path[1] : null,
    rating: 4.8, // Fallback
    sessions: 12 // Fallback
  })) : MOCK_MATCHES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects - Subtle */}
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
            { icon: TrendingUp, label: "Dashboard", href: "/dashboard", active: true },
            { icon: Users, label: "Find Matches", href: "/matches", active: false },
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
              <p className="font-medium truncate">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userProfile.department}</p>
            </div>
          </div>
          <BackendStatus className="mt-2" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8 relative z-10 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search skills, mentors, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-5 bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-muted rounded-full" />
              </button>
              <DefaultAvatar size="sm" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-2"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name.split(" ")[0]}</h1>
              <p className="text-muted-foreground/65">Ready to learn something new today?</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2"
          >
            {[
              { label: "Match Score", value: `${userProfile.matchScore}%`, icon: Star },
              { label: "Connections", value: userProfile.connectionsCount, icon: Users },
              { label: "Sessions", value: userProfile.sessionsCompleted, icon: Calendar },
              { label: "Rating", value: userProfile.rating, icon: Trophy }
            ].map((stat) => (
              <Card key={stat.label} className="glass border-border card-hover">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recommended Matches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Recommended Matches
                  </CardTitle>
                  <Link href="/matches" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-xl bg-secondary/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <ClickableAvatar
                            userName={match.name}
                            returnPath="/dashboard"
                            size="lg"
                          />             <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{match.name}</h3>
                              <Badge variant="outline" className="text-xs border-border bg-muted text-primary">
                                {match.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{match.department} • {match.year}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Network className="w-3 h-3 text-primary" />
                              <span>
                                {match.connectionDegree === 1 ? "1st" : match.connectionDegree === 2 ? "2nd" : "3rd"} degree
                                {match.mutualConnection && ` via ${match.mutualConnection}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.skillsHave.slice(0, 3).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-primary/50 bg-transparent text-foreground text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* My Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">My Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">I can teach</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skillsHave.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-primary/50 bg-transparent text-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">I want to learn</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skillsWant.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-primary/50 bg-transparent text-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Events
                    </CardTitle>
                    <Link href="/events" className="text-sm text-primary hover:text-primary/80">
                      View All
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <span className="text-xs text-muted-foreground">{event.participants} 👥</span>
                        </div>
                        <p className="text-xs text-primary">{event.date}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activityFeed.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-border mt-2" />
                        <div>
                          <p>
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-muted-foreground">{activity.action}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

