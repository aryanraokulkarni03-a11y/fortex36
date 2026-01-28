'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, RefreshCw, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MatchCard } from '@/components/features/match-card'
import { MatchCardSkeleton } from '@/components/ui/skeleton'
import { useMatches, useSeedDemo } from '@/lib/hooks/use-matches'
import { StaggerReveal, StaggerContainer, StaggerItem } from '@/components/animations/stagger-reveal'
import { toast } from 'sonner'

// Popular skills for quick search
const popularSkills = [
    'Python',
    'Machine Learning',
    'React',
    'JavaScript',
    'Data Science',
    'Web Development',
    'Java',
    'C++',
]

export default function MatchesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeSearch, setActiveSearch] = useState('')
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    // Use demo user ID for now (in production, get from session)
    const userId = 'u1'

    const {
        data: matches,
        isLoading,
        isError,
        error,
        refetch,
    } = useMatches(userId, activeSearch, !!activeSearch)

    const seedDemo = useSeedDemo()

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setActiveSearch(searchQuery.trim())
        }
    }

    const handleQuickSearch = (skill: string) => {
        setSearchQuery(skill)
        setActiveSearch(skill)
    }

    const handleConnect = (mentorId: string) => {
        toast.success(`Connection request sent!`, {
            description: `We'll notify you when they respond.`,
        })
    }

    const handleViewProfile = (mentorId: string) => {
        toast.info('Profile view coming soon!')
    }

    const handleSeedDemo = () => {
        seedDemo.mutate()
    }

    return (
        <div className="min-h-screen bg-background grain">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <StaggerReveal className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Find Mentors</h1>
                                <p className="text-muted-foreground">
                                    Search for a skill you want to learn and find the perfect peer mentor.
                                </p>
                            </div>
                        </div>
                    </StaggerReveal>

                    {/* Search Bar */}
                    <StaggerReveal delay={0.1} className="mb-6">
                        <div className="flex gap-3">
                            <motion.div
                                className="flex-1 relative"
                                animate={{
                                    scale: isSearchFocused ? 1.01 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Search for a skill (e.g., Python, Machine Learning, React)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className={`pl-12 h-14 text-base rounded-xl transition-all ${isSearchFocused ? 'ring-2 ring-primary glow-primary' : ''
                                        }`}
                                />
                            </motion.div>
                            <Button
                                onClick={handleSearch}
                                size="lg"
                                className="h-14 px-8 rounded-xl hover-lift"
                            >
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 rounded-xl hover-lift"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-5 h-5" />
                            </Button>
                        </div>
                    </StaggerReveal>

                    {/* Quick Search Pills */}
                    <StaggerReveal delay={0.2} className="mb-8">
                        <p className="text-sm text-muted-foreground mb-3">Popular skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {popularSkills.map((skill, idx) => (
                                <motion.button
                                    key={skill}
                                    onClick={() => handleQuickSearch(skill)}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSearch === skill
                                            ? 'bg-primary text-primary-foreground glow-primary'
                                            : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                                        }`}
                                >
                                    {skill}
                                </motion.button>
                            ))}
                        </div>
                    </StaggerReveal>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-6 rounded-2xl border border-border bg-card glass-card overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-foreground">Filters</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Year</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['1st', '2nd', '3rd', '4th'].map((year) => (
                                                <Badge
                                                    key={year}
                                                    variant={selectedFilters.includes(year) ? 'default' : 'secondary'}
                                                    className="cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => {
                                                        setSelectedFilters((prev) =>
                                                            prev.includes(year)
                                                                ? prev.filter((f) => f !== year)
                                                                : [...prev, year]
                                                        )
                                                    }}
                                                >
                                                    {year} Year
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Branch</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['CSE', 'ECE', 'ME', 'CE'].map((branch) => (
                                                <Badge
                                                    key={branch}
                                                    variant={selectedFilters.includes(branch) ? 'default' : 'secondary'}
                                                    className="cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => {
                                                        setSelectedFilters((prev) =>
                                                            prev.includes(branch)
                                                                ? prev.filter((f) => f !== branch)
                                                                : [...prev, branch]
                                                        )
                                                    }}
                                                >
                                                    {branch}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Connection</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['1st degree', '2nd degree', '3rd degree'].map((deg) => (
                                                <Badge
                                                    key={deg}
                                                    variant={selectedFilters.includes(deg) ? 'default' : 'secondary'}
                                                    className="cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => {
                                                        setSelectedFilters((prev) =>
                                                            prev.includes(deg)
                                                                ? prev.filter((f) => f !== deg)
                                                                : [...prev, deg]
                                                        )
                                                    }}
                                                >
                                                    {deg}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Search Info */}
                    <AnimatePresence>
                        {activeSearch && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 flex items-center justify-between"
                            >
                                <p className="text-muted-foreground">
                                    Showing mentors for{' '}
                                    <span className="text-primary font-medium">&quot;{activeSearch}&quot;</span>
                                    {matches && ` (${matches.length} found)`}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={isLoading}
                                    className="hover-lift"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results */}
                    <div>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <MatchCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-4">
                                    <X className="w-8 h-8 text-danger" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Something went wrong
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {error?.message || 'Failed to fetch matches. Please try again.'}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => refetch()} className="hover-lift">Try Again</Button>
                                    <Button variant="outline" onClick={handleSeedDemo} loading={seedDemo.isPending} className="hover-lift">
                                        Seed Demo Data
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Empty State - No Search */}
                        {!activeSearch && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <motion.div
                                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Search className="w-10 h-10 text-primary" />
                                </motion.div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Search for a skill
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Enter a skill you want to learn and we&apos;ll find the best peer mentors for you.
                                </p>
                            </motion.div>
                        )}

                        {/* Empty State - No Results */}
                        {activeSearch && !isLoading && !isError && matches?.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-warning" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    No mentors found
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    No one is currently teaching &quot;{activeSearch}&quot;. Try a different skill or check back later.
                                </p>
                                <Button variant="outline" onClick={handleSeedDemo} loading={seedDemo.isPending} className="hover-lift">
                                    Seed Demo Data
                                </Button>
                            </motion.div>
                        )}

                        {/* Results Grid */}
                        {matches && matches.length > 0 && (
                            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                                {matches.map((match) => (
                                    <StaggerItem key={match.user_id}>
                                        <MatchCard
                                            match={match}
                                            onConnect={handleConnect}
                                            onViewProfile={handleViewProfile}
                                        />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
