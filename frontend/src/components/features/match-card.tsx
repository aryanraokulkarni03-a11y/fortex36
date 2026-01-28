'use client'

import { motion } from 'framer-motion'
import { Star, MessageCircle, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { MatchResult } from '@/types/api'
import { formatMatchScore, getConnectionLabel, getYearLabel, getProficiencyLabel } from '@/lib/utils/cn'

interface MatchCardProps {
    match: MatchResult
    onConnect?: (userId: string) => void
    onViewProfile?: (userId: string) => void
    isConnecting?: boolean
}

/**
 * Card displaying a potential mentor match
 */
export function MatchCard({ match, onConnect, onViewProfile, isConnecting }: MatchCardProps) {
    const initials = match.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
            <Card className="overflow-hidden hover:border-primary/50 hover:glow-primary">
                {/* Match Score Banner */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-success to-primary" />

                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-14 h-14">
                            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                                {match.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {getYearLabel(match.year)} • {match.branch}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {formatMatchScore(match.match_score)}
                            </div>
                            <div className="text-xs text-muted-foreground">match</div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span>{getProficiencyLabel(match.proficiency)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{getConnectionLabel(match.connection_degree)}</span>
                        </div>
                    </div>

                    {/* Connection Path */}
                    {match.connection_path.length > 0 && (
                        <div className="mb-4 p-3 bg-secondary/50 rounded-md">
                            <p className="text-xs text-muted-foreground mb-1">Connection path:</p>
                            <div className="flex items-center gap-1 text-sm overflow-x-auto">
                                {match.connection_path.map((node, idx) => (
                                    <span key={idx} className="flex items-center gap-1 whitespace-nowrap">
                                        <span className="text-foreground">{node}</span>
                                        {idx < match.connection_path.length - 1 && (
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mutual Exchange */}
                    {match.mutual_exchange && (
                        <div className="mb-4">
                            <Badge variant="success" className="text-xs">
                                💡 Mutual: They want to learn {match.mutual_exchange}
                            </Badge>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            className="flex-1"
                            onClick={() => onConnect?.(match.user_id)}
                            loading={isConnecting}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Connect
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onViewProfile?.(match.user_id)}
                        >
                            View Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
