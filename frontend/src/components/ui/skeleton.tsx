import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
    className?: string
}

/**
 * Loading skeleton component
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
        />
    )
}

/**
 * Match card skeleton for loading states
 */
export function MatchCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Path */}
            <Skeleton className="h-16 w-full mb-4 rounded-md" />

            {/* Buttons */}
            <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>
        </div>
    )
}

/**
 * Dashboard stat card skeleton
 */
export function StatCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-12" />
                </div>
            </div>
        </div>
    )
}
