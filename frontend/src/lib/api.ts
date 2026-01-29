/**
 * SkillSync API Bridge
 * Centralizes all backend API calls
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const matches = await api.findMatches('u1', 'Python');
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Types matching backend Pydantic models
export interface Skill {
    id: string;
    name: string;
    category: string;
}

export interface UserSkill {
    user_id: string;
    skill_id: string;
    skill_name: string;
    proficiency: number;
    is_teaching: boolean;
    is_learning: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    year: number;
    branch: string;
    bio?: string;
    skills: UserSkill[];
}

export interface MatchResult {
    user_id: string;
    name: string;
    year: number;
    branch: string;
    proficiency: number;
    match_score: number;
    connection_degree: number;
    connection_path: string[];
    mutual_exchange: string | null;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    time: string;
    location: string;
    type: string;
    participants: number;
    max_participants: number;
    host: string;
    tags: string[];
}

export interface Session {
    id: string;
    mentor_name: string;
    topic: string;
    date: string;
    time: string;
    status: string;
    duration: string;
}

export interface GraphStats {
    total_users: number;
    total_skills: number;
    total_edges: number;
}

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    name: string;
    total_proficiency: number;
    skills_teaching: number;
    score: number;
}

export interface TrendingSkill {
    skill: string;
    learners: number;
}

export interface ConnectionRequest {
    from_user_id: string;
    to_user_id: string;
    skill_name: string;
    message?: string;
}

// API Error class
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

// Generic fetch wrapper with error handling
let authToken: string | null = null;

async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.detail || `HTTP ${response.status}`,
                response.status
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiError) throw error;

        // Network error
        throw new ApiError(
            'Unable to connect to backend. Is the server running?',
            0
        );
    }
}

export const setApiToken = (token: string | null) => {
    authToken = token;
};

// ============== API FUNCTIONS ==============

export const api = {
    // Health & Stats
    health: () => fetchAPI<{ status: string; database: string; graph_nodes: number }>('/health'),
    stats: () => fetchAPI<GraphStats>('/stats'),

    // Demo Data
    seedDemoData: () => fetchAPI<{ message: string; users: number; skills: number }>('/demo/seed', { method: 'POST' }),

    // Matching
    findMatches: (userId: string, skillName: string, limit = 5) =>
        fetchAPI<MatchResult[]>('/match/find', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, skill_name: skillName, limit }),
        }),

    sendConnectionRequest: (request: ConnectionRequest) =>
        fetchAPI<{ message: string; request_id: string }>('/match/connect', {
            method: 'POST',
            body: JSON.stringify(request),
        }),

    getConnectionRequests: (userId: string) =>
        fetchAPI<{ user_id: string; incoming: unknown[]; outgoing: unknown[] }>(`/match/requests/${userId}`),

    // User Management
    getCurrentUser: () => fetchAPI<User>('/me'),

    getUserProfile: (userId: string) => fetchAPI<{
        user_id: string;
        name: string;
        year: number;
        branch: string;
        teaching_skills: string[];
        learning_skills: string[];
    }>(`/user/${userId}`),

    registerUser: (data: { name: string; email: string; year: number; branch: string }) =>
        fetchAPI<{ message: string; user_id: string; user: User }>('/user/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateUserProfile: (userId: string, updates: { name?: string; year?: number; branch?: string }) =>
        fetchAPI<{ message: string }>(`/user/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        }),

    addUserSkill: (userId: string, skill: {
        skill_id: string;
        skill_name: string;
        proficiency: number;
        is_teaching?: boolean;
        is_learning?: boolean;
    }) =>
        fetchAPI<{ message: string }>(`/user/${userId}/skills`, {
            method: 'POST',
            body: JSON.stringify(skill),
        }),

    // Events
    getEvents: () => fetchAPI<Event[]>('/events'),
    getEvent: (eventId: string) => fetchAPI<Event>(`/events/${eventId}`),
    createEvent: (event: Event) => fetchAPI<{ message: string; event_id: string }>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
    }),
    registerForEvent: (eventId: string, userId: string) =>
        fetchAPI<{ message: string }>(`/events/${eventId}/register?user_id=${userId}`, { method: 'POST' }),

    // Sessions
    getSessions: () => fetchAPI<Session[]>('/sessions'),
    bookSession: (data: {
        mentor_id: string;
        topic: string;
        date: string;
        time: string;
        duration?: string;
    }) =>
        fetchAPI<{ message: string; session_id: string; session: Session }>('/sessions/book', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateSessionStatus: (sessionId: string, status: string) =>
        fetchAPI<{ message: string }>(`/sessions/${sessionId}?status=${status}`, { method: 'PUT' }),
    cancelSession: (sessionId: string) =>
        fetchAPI<{ message: string }>(`/sessions/${sessionId}`, { method: 'DELETE' }),

    // Skills & Analytics
    getTrendingSkills: () => fetchAPI<{ trending_skills: TrendingSkill[] }>('/skills/trending'),
    getSkillCategories: () => fetchAPI<{ categories: Record<string, string[]> }>('/skills/categories'),
    getLeaderboard: () => fetchAPI<{ leaderboard: LeaderboardEntry[] }>('/leaderboard'),

    // Graph Operations
    syncGraph: () => fetchAPI<{ status: string; nodes: number; edges: number }>('/graph/sync', { method: 'POST' }),
};

export default api;
