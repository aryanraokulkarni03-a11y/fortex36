'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Search, LayoutDashboard, User, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matches', label: 'Find Mentors', icon: Search },
    { href: '/sessions', label: 'Sessions', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
]

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:glow-primary transition-smooth">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            Skill<span className="text-primary">Sync</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-2',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm">
                            Sign In
                        </Button>
                        <Button size="sm" className="glow-primary">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-border"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            'px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-3',
                                            isActive
                                                ? 'text-primary bg-primary/10'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}
                            <div className="pt-4 px-4 flex flex-col gap-2 border-t border-border mt-2">
                                <Button variant="ghost" className="w-full justify-center">
                                    Sign In
                                </Button>
                                <Button className="w-full justify-center">
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>
        </header>
    )
}
