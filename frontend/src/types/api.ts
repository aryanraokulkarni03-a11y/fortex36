// Backend API types - matches Python Pydantic models exactly

export interface Skill {
    id: string
    name: string
    category: string
}

export interface UserSkill {
    user_id: string
    skill_id: string
    skill_name: string
    proficiency: number // 1-5
    is_teaching: boolean
    is_learning: boolean
}

export interface User {
    id: string
    name: string
    email: string
    year: number // 1-4
    branch: string // CSE, ECE, etc.
    skills: UserSkill[]
}

export interface MatchRequest {
    user_id: string
    skill_name: string
    limit?: number // default 5
}

export interface MatchResult {
    user_id: string
    name: string
    year: number
    branch: string
    proficiency: number
    match_score: number
    connection_degree: number // 1, 2, or 3
    connection_path: string[]
    mutual_exchange: string | null
}

export interface GraphStats {
    total_users: number
    total_skills: number
    total_edges: number
}

// API Response wrappers
export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

// Frontend-specific types
export interface LoadingState {
    isLoading: boolean
    error: string | null
}
