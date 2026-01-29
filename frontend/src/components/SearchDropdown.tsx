"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { User, Sparkles, Users, GraduationCap, ArrowLeft } from "lucide-react";
import DefaultAvatar from "./DefaultAvatar";
import { searchUsers, getUsersBySkill, getUsersByDepartment, searchDepartments, UserProfile, DEPARTMENTS } from "@/lib/users";
import { searchSkills } from "@/lib/skills";

interface SearchDropdownProps {
    query: string;
    isOpen: boolean;
    onClose: () => void;
    returnPath: string;
}

export default function SearchDropdown({ query, isOpen, onClose, returnPath }: SearchDropdownProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);
    const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
    const [matchedDepartments, setMatchedDepartments] = useState<string[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [skillUsers, setSkillUsers] = useState<UserProfile[]>([]);
    const [departmentUsers, setDepartmentUsers] = useState<UserProfile[]>([]);

    // Current user name - won't show in search results
    const CURRENT_USER_NAME = "Kushaan Parekh";

    useEffect(() => {
        if (query.trim()) {
            const users = searchUsers(query).filter(u => u.name !== CURRENT_USER_NAME);
            const skills = searchSkills(query);
            const departments = searchDepartments(query);
            setMatchedUsers(users);
            setMatchedSkills(skills);
            setMatchedDepartments(departments);
            setSelectedSkill(null);
            setSelectedDepartment(null);
            setSkillUsers([]);
            setDepartmentUsers([]);
        } else {
            setMatchedUsers([]);
            setMatchedSkills([]);
            setMatchedDepartments([]);
            setSelectedSkill(null);
            setSelectedDepartment(null);
            setSkillUsers([]);
            setDepartmentUsers([]);
        }
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleUserClick = (user: UserProfile) => {
        const params = new URLSearchParams({
            returnPath,
            name: user.name,
            department: user.department,
            year: user.year,
            skillsHave: user.skillsHave.join(','),
            skillsWant: user.skillsWant.join(','),
            rating: user.rating.toString(),
            sessions: user.sessions.toString(),
            ...(user.matchScore !== undefined && { matchScore: user.matchScore.toString() }),
        });
        router.push(`/user/${user.id}?${params.toString()}`);
        onClose();
    };

    const handleSkillClick = (skill: string) => {
        const users = getUsersBySkill(skill).filter(u => u.name !== CURRENT_USER_NAME);
        setSelectedSkill(skill);
        setSelectedDepartment(null);
        setSkillUsers(users);
        setDepartmentUsers([]);
    };

    const handleDepartmentClick = (department: string) => {
        const users = getUsersByDepartment(department).filter(u => u.name !== CURRENT_USER_NAME);
        setSelectedDepartment(department);
        setSelectedSkill(null);
        setDepartmentUsers(users);
        setSkillUsers([]);
    };

    const handleBackToResults = () => {
        setSelectedSkill(null);
        setSelectedDepartment(null);
        setSkillUsers([]);
        setDepartmentUsers([]);
    };

    if (!isOpen || !query.trim()) return null;

    const hasNoResults = matchedUsers.length === 0 && matchedSkills.length === 0 && matchedDepartments.length === 0;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
        >
            {/* Show users who can teach selected skill */}
            {selectedSkill && (
                <div className="p-2">
                    <button
                        onClick={handleBackToResults}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to search results
                    </button>
                    <div className="px-3 py-2 text-sm font-medium text-primary flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        People who can teach "{selectedSkill}"
                    </div>
                    {skillUsers.length > 0 ? (
                        skillUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => handleUserClick(user)}
                                className="flex items-center gap-3 px-3 py-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors"
                            >
                                <DefaultAvatar size="sm" />
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.department} • {user.year}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-center text-muted-foreground">
                            No matches found at the moment
                        </div>
                    )}
                </div>
            )}

            {/* Show users in selected department */}
            {selectedDepartment && (
                <div className="p-2">
                    <button
                        onClick={handleBackToResults}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to search results
                    </button>
                    <div className="px-3 py-2 text-sm font-medium text-primary flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Students in {selectedDepartment}
                    </div>
                    {departmentUsers.length > 0 ? (
                        departmentUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => handleUserClick(user)}
                                className="flex items-center gap-3 px-3 py-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors"
                            >
                                <DefaultAvatar size="sm" />
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.department} • {user.year}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-4 text-center text-muted-foreground">
                            No matches found at the moment
                        </div>
                    )}
                </div>
            )}

            {/* Show search results */}
            {!selectedSkill && !selectedDepartment && (
                <>
                    {hasNoResults ? (
                        <div className="p-4 text-center">
                            <p className="text-muted-foreground">No users found</p>
                            <p className="text-muted-foreground">No skills found</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {/* Users Section */}
                            {matchedUsers.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <User className="w-3 h-3" />
                                        Users
                                    </div>
                                    {matchedUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                            className="flex items-center gap-3 px-3 py-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <DefaultAvatar size="sm" />
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.department} • {user.year}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {matchedUsers.length === 0 && query.trim() && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    No users found
                                </div>
                            )}

                            {/* Skills Section */}
                            {matchedSkills.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2 mt-2">
                                        <Sparkles className="w-3 h-3" />
                                        Skills
                                    </div>
                                    {matchedSkills.map(skill => (
                                        <div
                                            key={skill}
                                            onClick={() => handleSkillClick(skill)}
                                            className="flex items-center justify-between px-3 py-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <span className="font-medium">{skill}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                Find teachers
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {matchedSkills.length === 0 && query.trim() && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    No skills found
                                </div>
                            )}

                            {/* Departments Section */}
                            {matchedDepartments.length > 0 && (
                                <>
                                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2 mt-2">
                                        <GraduationCap className="w-3 h-3" />
                                        Departments
                                    </div>
                                    {matchedDepartments.map(dept => (
                                        <div
                                            key={dept}
                                            onClick={() => handleDepartmentClick(dept)}
                                            className="flex items-center justify-between px-3 py-3 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <span className="font-medium">{dept}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                Find students
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
