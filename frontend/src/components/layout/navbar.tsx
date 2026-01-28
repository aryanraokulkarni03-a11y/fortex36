'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
    { name: 'Find Mentors', href: '/matches' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Events', href: '/events' },
]

// Links visible on the landing page (kept minimal as requested)
const landingLinks: { name: string; href: string }[] = []

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass-strong shadow-lg'
                : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Gradient line at top */}
            <motion.div
                className="h-0.5 bg-gradient-to-r from-primary via-success to-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isScrolled ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Zap className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold">
                            Skill<span className="text-primary">Sync</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {(pathname === '/' ? landingLinks : navLinks).map((link) => {
                            const isActive = pathname === link.href

                            return (
                                <Link key={link.href} href={link.href}>
                                    <motion.div
                                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="hover-lift">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="hover-lift glow-primary">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-secondary transition-smooth"
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="md:hidden glass-strong border-t border-border overflow-hidden"
                    >
                        <div className="py-4 px-4 space-y-1">
                            {navLinks.map((link, idx) => {
                                const isActive = pathname === link.href

                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                )
                            })}

                            <motion.div
                                className="pt-4 border-t border-border mt-4 space-y-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link href="/login">
                                    <Button variant="outline" className="w-full rounded-xl">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="w-full rounded-xl glow-primary">
                                        Get Started
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
