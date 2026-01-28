// API utility functions for SkillSync

const API_BASE = "/api";

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "API request failed");
    }

    return response.json();
}

// Skills API
export const skillsAPI = {
    getAll: () => fetchAPI<unknown[]>("/skills"),
    create: (data: { name: string; category: string; icon?: string }) =>
        fetchAPI("/skills", { method: "POST", body: JSON.stringify(data) }),
};

// User Skills API
export const userSkillsAPI = {
    getMySkills: () => fetchAPI<unknown[]>("/user/skills"),
    addSkill: (data: {
        skillId: string;
        proficiency: number;
        isTeaching?: boolean;
        isLearning?: boolean;
    }) => fetchAPI("/user/skills", { method: "POST", body: JSON.stringify(data) }),
    removeSkill: (skillId: string) =>
        fetchAPI(`/user/skills?skillId=${skillId}`, { method: "DELETE" }),
};

// Profile API
export const profileAPI = {
    get: () => fetchAPI<unknown>("/user/profile"),
    update: (data: {
        name?: string;
        year?: number;
        branch?: string;
        bio?: string;
    }) => fetchAPI("/user/profile", { method: "PATCH", body: JSON.stringify(data) }),
    setup: (data: { name: string; year: number; branch: string; bio?: string }) =>
        fetchAPI("/user/profile", { method: "POST", body: JSON.stringify(data) }),
};

// Matches API
export const matchesAPI = {
    find: (skillName: string, limit = 5) =>
        fetchAPI<unknown[]>("/matches", {
            method: "POST",
            body: JSON.stringify({ skillName, limit }),
        }),
    getHistory: () => fetchAPI<unknown[]>("/matches"),
};

// Events API
export const eventsAPI = {
    getAll: (filters?: { category?: string; tags?: string[]; upcoming?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.category) params.set("category", filters.category);
        if (filters?.tags) params.set("tags", filters.tags.join(","));
        if (filters?.upcoming) params.set("upcoming", "true");
        return fetchAPI<unknown[]>(`/events?${params.toString()}`);
    },
    create: (data: {
        title: string;
        description: string;
        category: string;
        tags?: string[];
        date: string;
        location?: string;
        isOnline?: boolean;
        link?: string;
        organizer: string;
    }) => fetchAPI("/events", { method: "POST", body: JSON.stringify(data) }),
};

// Ratings API
export const ratingsAPI = {
    submit: (data: {
        matchId: string;
        rateeId: string;
        teachingScore: number;
        patienceScore: number;
        clarityScore: number;
        punctualityScore: number;
        comment?: string;
    }) => fetchAPI("/ratings", { method: "POST", body: JSON.stringify(data) }),
    getForUser: (userId: string) => fetchAPI<unknown>(`/ratings?userId=${userId}`),
};

// AI Recommendations API
export const aiAPI = {
    careerPath: (context: { skills: string[]; year: number; branch: string }) =>
        fetchAPI("/ai/recommend", {
            method: "POST",
            body: JSON.stringify({ type: "career_path", context }),
        }),
    learnNext: (context: { currentSkills: string[]; interest?: string }) =>
        fetchAPI("/ai/recommend", {
            method: "POST",
            body: JSON.stringify({ type: "learn_next", context }),
        }),
    matchSummary: (context: {
        skill: string;
        mentorName: string;
        mentorYear: number;
        mentorBranch: string;
        matchScore: number;
        connectionDegree: number;
        mutualExchange?: string;
    }) =>
        fetchAPI<{ summary: string }>("/ai/recommend", {
            method: "POST",
            body: JSON.stringify({ type: "match_summary", context }),
        }),
    skillGap: (context: { currentSkills: string[]; targetRole: string }) =>
        fetchAPI("/ai/recommend", {
            method: "POST",
            body: JSON.stringify({ type: "skill_gap", context }),
        }),
};

// GraphRAG API (direct to microservice for development)
const GRAPHRAG_URL = process.env.NEXT_PUBLIC_GRAPHRAG_URL || "http://localhost:8000";

export const graphragAPI = {
    health: () => fetch(`${GRAPHRAG_URL}/health`).then((r) => r.json()),
    stats: () => fetch(`${GRAPHRAG_URL}/stats`).then((r) => r.json()),
    seedDemo: () =>
        fetch(`${GRAPHRAG_URL}/demo/seed`, { method: "POST" }).then((r) => r.json()),
    findMatch: (userId: string, skillName: string, limit = 5) =>
        fetch(`${GRAPHRAG_URL}/match/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, skill_name: skillName, limit }),
        }).then((r) => r.json()),
    getConnections: (userId: string) =>
        fetch(`${GRAPHRAG_URL}/user/${userId}/connections`).then((r) => r.json()),
};
