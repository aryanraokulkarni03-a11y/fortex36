'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { StaggerReveal, StaggerContainer, StaggerItem } from '@/components/animations/stagger-reveal'

const footerLinks = {
    product: [
        { name: 'Find Mentors', href: '/matches' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Events', href: '/events' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
    ],
}

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', href: 'mailto:support@skillsync.app', icon: Mail },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-background relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/30 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <StaggerReveal className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <motion.div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Zap className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold">
                                Skill<span className="text-primary">Sync</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs mb-6">
                            AI-powered peer learning network for SRM AP. Connect with the right mentor, master any skill.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </StaggerReveal>

                    {/* Product Links */}
                    <StaggerReveal delay={0.1}>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </StaggerReveal>

                    {/* Company Links */}
                    <StaggerReveal delay={0.15}>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </StaggerReveal>

                    {/* Legal Links */}
                    <StaggerReveal delay={0.2}>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </StaggerReveal>
                </div>

                {/* Bottom Section */}
                <StaggerReveal delay={0.25}>
                    <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} SkillSync. All rights reserved.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Made with ❤️ for SRM AP students
                        </p>
                    </div>
                </StaggerReveal>
            </div>
        </footer>
    )
}
