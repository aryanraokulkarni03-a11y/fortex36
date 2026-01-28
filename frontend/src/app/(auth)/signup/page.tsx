'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

const branches = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'AIDS', 'AIML']
const years = [1, 2, 3, 4]

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        year: '',
        branch: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!formData.email.endsWith('@srmap.edu.in'))
            newErrors.email = 'Only SRM AP email addresses are allowed'
        if (!formData.password) newErrors.password = 'Password is required'
        else if (formData.password.length < 8)
            newErrors.password = 'Password must be at least 8 characters'
        if (!formData.year) newErrors.year = 'Year is required'
        if (!formData.branch) newErrors.branch = 'Branch is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setIsLoading(true)

        // Simulate signup (in production, call API)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast.success('Account created!', {
            description: 'Welcome to SkillSync! Redirecting...',
        })

        // Redirect to dashboard
        window.location.href = '/dashboard'
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/3 -right-20 w-96 h-96 rounded-full blur-[100px]"
                    style={{ background: 'radial-gradient(circle, rgba(0, 138, 255, 0.15) 0%, transparent 70%)' }}
                    animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full blur-[80px]"
                    style={{ background: 'radial-gradient(circle, rgba(61, 214, 140, 0.12) 0%, transparent 70%)' }}
                    animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-border/50 glass-card elevated-xl overflow-hidden">
                    {/* Gradient Top Bar */}
                    <div className="h-1 bg-gradient-to-r from-success via-primary to-success" />

                    <CardHeader className="text-center pb-2 pt-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                            <motion.div
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-primary flex items-center justify-center"
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Zap className="w-7 h-7 text-white" />
                            </motion.div>
                        </Link>
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>Join the SkillSync peer learning network</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <motion.div
                                className="space-y-2"
                                animate={{ scale: focusedField === 'name' ? 1.01 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Aryan Kumar"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 h-12 rounded-xl ${focusedField === 'name' ? 'ring-2 ring-primary' : ''
                                            }`}
                                        error={errors.name}
                                    />
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                className="space-y-2"
                                animate={{ scale: focusedField === 'email' ? 1.01 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="yourname@srmap.edu.in"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 h-12 rounded-xl ${focusedField === 'email' ? 'ring-2 ring-primary' : ''
                                            }`}
                                        error={errors.email}
                                    />
                                </div>
                            </motion.div>

                            {/* Year and Branch */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="space-y-2"
                                    animate={{ scale: focusedField === 'year' ? 1.02 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <label htmlFor="year" className="text-sm font-medium text-foreground">
                                        Year
                                    </label>
                                    <select
                                        id="year"
                                        value={formData.year}
                                        onChange={(e) => handleChange('year', e.target.value)}
                                        onFocus={() => setFocusedField('year')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`flex h-12 w-full rounded-xl border bg-background px-3 py-2 text-sm transition-smooth focus-ring ${errors.year ? 'border-danger' : 'border-border hover:border-primary/50'
                                            } ${focusedField === 'year' ? 'ring-2 ring-primary' : ''}`}
                                    >
                                        <option value="">Select</option>
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'} Year
                                            </option>
                                        ))}
                                    </select>
                                    {errors.year && (
                                        <p className="text-xs text-danger">{errors.year}</p>
                                    )}
                                </motion.div>
                                <motion.div
                                    className="space-y-2"
                                    animate={{ scale: focusedField === 'branch' ? 1.02 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <label htmlFor="branch" className="text-sm font-medium text-foreground">
                                        Branch
                                    </label>
                                    <select
                                        id="branch"
                                        value={formData.branch}
                                        onChange={(e) => handleChange('branch', e.target.value)}
                                        onFocus={() => setFocusedField('branch')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`flex h-12 w-full rounded-xl border bg-background px-3 py-2 text-sm transition-smooth focus-ring ${errors.branch ? 'border-danger' : 'border-border hover:border-primary/50'
                                            } ${focusedField === 'branch' ? 'ring-2 ring-primary' : ''}`}
                                    >
                                        <option value="">Select</option>
                                        {branches.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branch && (
                                        <p className="text-xs text-danger">{errors.branch}</p>
                                    )}
                                </motion.div>
                            </div>

                            {/* Password */}
                            <motion.div
                                className="space-y-2"
                                animate={{ scale: focusedField === 'password' ? 1.01 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 pr-10 h-12 rounded-xl ${focusedField === 'password' ? 'ring-2 ring-primary' : ''
                                            }`}
                                        error={errors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-12 text-base rounded-xl hover-lift glow-success"
                                loading={isLoading}
                            >
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Terms */}
                        <p className="text-xs text-muted-foreground text-center mt-4">
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </p>

                        {/* Login Link */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
