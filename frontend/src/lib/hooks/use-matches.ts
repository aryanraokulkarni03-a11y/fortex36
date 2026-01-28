import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchesApi } from '@/lib/api/matches'
import { toast } from 'sonner'

/**
 * Hook to find matches with caching and error handling
 */
export function useMatches(userId: string, skillName: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['matches', userId, skillName],
        queryFn: () => matchesApi.find({ user_id: userId, skill_name: skillName }),
        enabled: enabled && !!userId && !!skillName,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

/**
 * Hook to get user connections
 */
export function useUserConnections(userId: string) {
    return useQuery({
        queryKey: ['connections', userId],
        queryFn: () => matchesApi.getUserConnections(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

/**
 * Hook to get graph stats
 */
export function useGraphStats() {
    return useQuery({
        queryKey: ['graph-stats'],
        queryFn: () => matchesApi.getStats(),
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // Refresh every minute
    })
}

/**
 * Hook to sync graph (mutation)
 */
export function useSyncGraph() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => matchesApi.syncGraph(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph-stats'] })
            queryClient.invalidateQueries({ queryKey: ['matches'] })
            toast.success('Graph synced successfully!')
        },
        onError: (error: Error) => {
            toast.error(`Sync failed: ${error.message}`)
        },
    })
}

/**
 * Hook to seed demo data
 */
export function useSeedDemo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => matchesApi.seedDemo(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph-stats'] })
            toast.success('Demo data seeded!')
        },
        onError: (error: Error) => {
            toast.error(`Seed failed: ${error.message}`)
        },
    })
}
