import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
}

/**
 * Format match score as percentage
 */
export function formatMatchScore(score: number): string {
    return `${Math.round(score)}%`
}

/**
 * Get connection degree label
 */
export function getConnectionLabel(degree: number): string {
    switch (degree) {
        case 1:
            return '1st degree'
        case 2:
            return '2nd degree'
        case 3:
            return '3rd degree'
        default:
            return `${degree}th degree`
    }
}

/**
 * Get year label
 */
export function getYearLabel(year: number): string {
    switch (year) {
        case 1:
            return '1st Year'
        case 2:
            return '2nd Year'
        case 3:
            return '3rd Year'
        case 4:
            return '4th Year'
        default:
            return `Year ${year}`
    }
}

/**
 * Proficiency level to label
 */
export function getProficiencyLabel(level: number): string {
    switch (level) {
        case 1:
            return 'Beginner'
        case 2:
            return 'Intermediate'
        case 3:
            return 'Proficient'
        case 4:
            return 'Advanced'
        case 5:
            return 'Expert'
        default:
            return 'Unknown'
    }
}
