import apiClient from './client'
import type { MatchRequest, MatchResult, GraphStats } from '@/types/api'

// API Response types
interface UserConnections {
    user_id: string
    skills: string[]
    connections: Array<{
        user_id: string
        name: string
        shared_skills: string[]
    }>
}

interface SyncResponse {
    status: string
    users?: number
    skills?: number
    nodes?: number
    edges?: number
    message?: string
}

interface SeedResponse {
    message: string
    users: number
    skills: number
}

/**
 * Match finding and graph operations
 */
export const matchesApi = {
    /**
     * Find mentors for a skill
     */
    find: async (request: MatchRequest): Promise<MatchResult[]> => {
        return apiClient.post('/match/find', request)
    },

    /**
     * Get user's connections in the knowledge graph
     */
    getUserConnections: async (userId: string): Promise<UserConnections> => {
        return apiClient.get(`/user/${userId}/connections`)
    },

    /**
     * Get graph statistics
     */
    getStats: async (): Promise<GraphStats> => {
        return apiClient.get('/stats')
    },

    /**
     * Sync graph with MongoDB
     */
    syncGraph: async (): Promise<SyncResponse> => {
        return apiClient.post('/graph/sync')
    },

    /**
     * Seed demo data (for testing)
     */
    seedDemo: async (): Promise<SeedResponse> => {
        return apiClient.post('/demo/seed')
    },
}
