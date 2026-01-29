/**
 * SkillSync API Hooks
 * React hooks for data fetching with loading and error states
 * 
 * Usage:
 *   const { data: events, loading, error } = useEvents();
 *   const { data: matches, refetch } = useMatches('u1', 'Python');
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError, Event, Session, MatchResult, LeaderboardEntry, TrendingSkill } from './api';

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Generic hook for API calls
function useApi<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = []
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refetch: fetch };
}

// ============== HOOKS ==============

export function useEvents(): UseApiResult<Event[]> {
    return useApi(() => api.getEvents(), []);
}

export function useSessions(): UseApiResult<Session[]> {
    return useApi(() => api.getSessions(), []);
}

export function useMatches(userId: string, skillName: string): UseApiResult<MatchResult[]> {
    return useApi(
        () => api.findMatches(userId, skillName),
        [userId, skillName]
    );
}

export function useLeaderboard(): UseApiResult<LeaderboardEntry[]> {
    return useApi(
        async () => {
            const result = await api.getLeaderboard();
            return result.leaderboard;
        },
        []
    );
}

export function useTrendingSkills(): UseApiResult<TrendingSkill[]> {
    return useApi(
        async () => {
            const result = await api.getTrendingSkills();
            return result.trending_skills;
        },
        []
    );
}

export function useSkillCategories(): UseApiResult<Record<string, string[]>> {
    return useApi(
        async () => {
            const result = await api.getSkillCategories();
            return result.categories;
        },
        []
    );
}

export function useCurrentUser() {
    return useApi(() => api.getCurrentUser(), []);
}

export function useUserProfile(userId: string) {
    return useApi(() => api.getUserProfile(userId), [userId]);
}

export function useGraphStats() {
    return useApi(() => api.stats(), []);
}

export function useHealth() {
    return useApi(() => api.health(), []);
}

// ============== MUTATIONS ==============

export function useSeedDemoData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const seed = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await api.seedDemoData();
            setSuccess(true);
            return true;
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to seed demo data');
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { seed, loading, error, success };
}

export function useSendConnectionRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const send = useCallback(async (
        fromUserId: string,
        toUserId: string,
        skillName: string,
        message?: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.sendConnectionRequest({
                from_user_id: fromUserId,
                to_user_id: toUserId,
                skill_name: skillName,
                message,
            });
            return result.request_id;
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to send connection request');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { send, loading, error };
}

export function useBookSession() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const book = useCallback(async (data: {
        mentor_id: string;
        topic: string;
        date: string;
        time: string;
        duration?: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.bookSession(data);
            return result.session;
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to book session');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { book, loading, error };
}
