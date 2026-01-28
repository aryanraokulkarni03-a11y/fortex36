"use client";

import { useState } from "react";
import { Search, Users, Star, Mail, Calendar } from "lucide-react";

export default function MentorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("all");

    // Demo mentors data (in production, this would come from API)
    const mentors = [
        {
            id: "u1",
            name: "Rahul Kumar",
            email: "rahul@srmap.edu.in",
            year: 4,
            branch: "CSE",
            skills: ["Machine Learning", "Python", "Data Science"],
            rating: 4.8,
            sessions: 24,
            image: "👨‍💻",
        },
        {
            id: "u2",
            name: "Priya Singh",
            email: "priya@srmap.edu.in",
            year: 3,
            branch: "CSE",
            skills: ["React", "JavaScript", "Web Development"],
            rating: 4.6,
            sessions: 18,
            image: "👩‍💻",
        },
        {
            id: "u3",
            name: "Amit Verma",
            email: "amit@srmap.edu.in",
            year: 2,
            branch: "CSE",
            skills: ["Python", "Django", "Backend"],
            rating: 4.5,
            sessions: 12,
            image: "🧑‍💻",
        },
        {
            id: "u4",
            name: "Sneha Patel",
            email: "sneha@srmap.edu.in",
            year: 4,
            branch: "ECE",
            skills: ["Data Science", "Python", "Statistics"],
            rating: 4.9,
            sessions: 32,
            image: "👩‍🔬",
        },
        {
            id: "u5",
            name: "Vikram Reddy",
            email: "vikram@srmap.edu.in",
            year: 3,
            branch: "CSE",
            skills: ["DSA", "Node.js", "System Design"],
            rating: 4.7,
            sessions: 21,
            image: "🧑‍🎓",
        },
    ];

    const allSkills = Array.from(
        new Set(mentors.flatMap((m) => m.skills))
    ).sort();

    const filteredMentors = mentors.filter((mentor) => {
        const matchesSearch =
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.skills.some((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase())
            );
        const matchesSkill =
            selectedSkill === "all" || mentor.skills.includes(selectedSkill);
        return matchesSearch && matchesSkill;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-10 h-10 text-blue-500" />
                        <h1 className="text-4xl font-bold">Find Mentors</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Connect with peer experts across campus. Learn from the best.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Skill Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedSkill("all")}
                            className={`px-4 py-2 rounded-full transition-colors ${selectedSkill === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                }`}
                        >
                            All Skills
                        </button>
                        {allSkills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => setSelectedSkill(skill)}
                                className={`px-4 py-2 rounded-full transition-colors ${selectedSkill === skill
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-gray-400">
                    Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""}
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentors.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                        >
                            {/* Profile Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-5xl">{mentor.image}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-1">
                                        {mentor.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Year {mentor.year} • {mentor.branch}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{mentor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{mentor.sessions} sessions</span>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                                <div className="text-sm font-semibold text-gray-400 mb-2">
                                    Teaching:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.skills.slice(0, 3).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {mentor.skills.length > 3 && (
                                        <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs">
                                            +{mentor.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm font-medium">Connect</span>
                                </button>
                                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredMentors.length === 0 && (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            No mentors found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
