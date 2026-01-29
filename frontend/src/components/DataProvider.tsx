/**
 * SkillSync Data Provider
 * Centralized data fetching with graceful fallback to mock data when backend is unavailable
 * 
 * Usage:
 *   <DataProvider>
 *     <App />
 *   </DataProvider>
 * 
 *   const { events, sessions, matches, loading, error, backendConnected } = useData();
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { api, Event, Session, MatchResult, LeaderboardEntry, TrendingSkill, ApiError, setApiToken } from '@/lib/api';

// Mock data fallbacks (from original frontend)
const MOCK_EVENTS: Event[] = [
    {
        id: 'e1',
        title: 'Machine Learning Study Group',
        description: 'Weekly ML concepts discussion and problem solving',
        time: 'Today, 6:00 PM',
        location: 'Online (Discord)',
        type: 'Study Group',
        participants: 12,
        max_participants: 20,
        host: 'Priya Sharma',
        tags: ['Machine Learning', 'Python', 'Beginners Welcome']
    },
    {
        id: 'e2',
        title: 'React Workshop: Building Modern UIs',
        description: 'Hands-on workshop on React hooks, state management, and animations',
        time: 'Tomorrow, 4:00 PM',
        location: 'Seminar Hall A',
        type: 'Workshop',
        participants: 25,
        max_participants: 30,
        host: 'Kushaan Parekh',
        tags: ['React', 'Frontend', 'Workshop']
    },
    {
        id: 'e3',
        title: 'Hackathon Prep Session',
        description: 'Team formation and project ideation for upcoming hackathon',
        time: 'Saturday, 10:00 AM',
        location: 'Lab 204',
        type: 'Hackathon',
        participants: 8,
        max_participants: 15,
        host: 'Arjun Reddy',
        tags: ['Hackathon', 'Team', 'Full Stack']
    }
];

const MOCK_SESSIONS: Session[] = [
    {
        id: 's1',
        mentor_name: 'Rahul Kumar',
        topic: 'Intro to Machine Learning',
        date: 'Today',
        time: '04:00 PM',
        status: 'Scheduled',
        duration: '1 hr'
    },
    {
        id: 's2',
        mentor_name: 'Priya Singh',
        topic: 'React State Management',
        date: 'Tomorrow',
        time: '10:00 AM',
        status: 'Scheduled',
        duration: '45 min'
    }
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, user_id: 'u1', name: 'Priya Sharma', total_proficiency: 15, skills_teaching: 3, score: 45 },
    { rank: 2, user_id: 'u2', name: 'Rohit Verma', total_proficiency: 12, skills_teaching: 3, score: 36 },
    { rank: 3, user_id: 'u3', name: 'Sneha Gupta', total_proficiency: 10, skills_teaching: 2, score: 20 },
];

const MOCK_TRENDING: TrendingSkill[] = [
    { skill: 'Machine Learning', learners: 15 },
    { skill: 'React', learners: 12 },
    { skill: 'Python', learners: 10 },
];

interface DataContextType {
    // Connection state
    backendConnected: boolean;
    loading: boolean;
    error: string | null;

    // Data
    events: Event[];
    sessions: Session[];
    leaderboard: LeaderboardEntry[];
    trendingSkills: TrendingSkill[];

    // Current user
    currentUserId: string;
    currentUserName: string;

    // Actions
    findMatches: (skillName: string) => Promise<MatchResult[]>;
    sendConnection: (toUserId: string, skillName: string, message?: string) => Promise<boolean>;
    seedDemoData: () => Promise<boolean>;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData(): DataContextType {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

interface DataProviderProps {
    children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
    const { data: session, status: sessionStatus } = useSession();

    // Connection state
    const [backendConnected, setBackendConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
    const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>(MOCK_TRENDING);

    // Current user (MVP: demo user)
    // Current user
    const [currentUserId, setCurrentUserId] = useState('u1');
    const [currentUserName, setCurrentUserName] = useState('Kushaan Parekh');

    // Auth integration
    useEffect(() => {
        if (sessionStatus === 'authenticated' && session?.user) {
            const user = session.user as any;
            if (user.accessToken) setApiToken(user.accessToken);
            if (user.id) setCurrentUserId(user.id);
            if (user.name) setCurrentUserName(user.name);
            refreshData();
        } else if (sessionStatus === 'unauthenticated') {
            setApiToken(null);
            // Optionally reset to demo user or guest
        }
    }, [session, sessionStatus]);

    // Check backend health and load data
    const refreshData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Check backend health
            const health = await api.health();
            setBackendConnected(health.status === 'healthy' || health.status === 'degraded');

            // Load data in parallel
            const [eventsRes, sessionsRes, leaderboardRes, trendingRes] = await Promise.allSettled([
                api.getEvents(),
                api.getSessions(),
                api.getLeaderboard(),
                api.getTrendingSkills()
            ]);

            // Update state with successful results, fallback to mock for failures
            if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value);
            if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value);
            if (leaderboardRes.status === 'fulfilled') setLeaderboard(leaderboardRes.value.leaderboard);
            if (trendingRes.status === 'fulfilled') setTrendingSkills(trendingRes.value.trending_skills);

        } catch (err) {
            // Backend unavailable - use mock data
            setBackendConnected(false);
            if (err instanceof ApiError) {
                setError(`Backend unavailable: ${err.message}. Using demo data.`);
            } else {
                setError('Using demo data (backend offline)');
            }
            console.warn('Backend unavailable, using mock data');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Find matches
    const findMatches = useCallback(async (skillName: string): Promise<MatchResult[]> => {
        if (!backendConnected) {
            // Return empty when backend not connected
            return [];
        }
        try {
            return await api.findMatches(currentUserId, skillName);
        } catch (err) {
            console.error('Failed to find matches:', err);
            return [];
        }
    }, [backendConnected, currentUserId]);

    // Send connection request
    const sendConnection = useCallback(async (
        toUserId: string,
        skillName: string,
        message?: string
    ): Promise<boolean> => {
        if (!backendConnected) {
            // Simulate success when offline
            return true;
        }
        try {
            await api.sendConnectionRequest({
                from_user_id: currentUserId,
                to_user_id: toUserId,
                skill_name: skillName,
                message
            });
            return true;
        } catch (err) {
            console.error('Failed to send connection:', err);
            return false;
        }
    }, [backendConnected, currentUserId]);

    // Seed demo data
    const seedDemoData = useCallback(async (): Promise<boolean> => {
        try {
            await api.seedDemoData();
            await refreshData();
            return true;
        } catch (err) {
            console.error('Failed to seed demo data:', err);
            return false;
        }
    }, [refreshData]);

    const value: DataContextType = {
        backendConnected,
        loading,
        error,
        events,
        sessions,
        leaderboard,
        trendingSkills,
        currentUserId,
        currentUserName,
        findMatches,
        sendConnection,
        seedDemoData,
        refreshData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export default DataProvider;
