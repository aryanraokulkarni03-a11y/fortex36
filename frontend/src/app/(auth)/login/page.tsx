'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const validateEmail = (email: string) => {
        if (!email) return 'Email is required'
        if (!email.endsWith('@srmap.edu.in')) return 'Only SRM AP email addresses are allowed'
        return undefined
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        const emailError = validateEmail(email)
        const passwordError = !password ? 'Password is required' : undefined

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError })
            return
        }

        setErrors({})
        setIsLoading(true)

        // Simulate login (in production, use NextAuth signIn)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast.success('Login successful!', {
            description: 'Redirecting to dashboard...',
        })

        // Redirect to dashboard
        window.location.href = '/dashboard'
    }

    return (
        <div className="relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[100px]"
                    style={{ background: 'radial-gradient(circle, rgba(0, 138, 255, 0.15) 0%, transparent 70%)' }}
                    animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-[80px]"
                    style={{ background: 'radial-gradient(circle, rgba(61, 214, 140, 0.12) 0%, transparent 70%)' }}
                    animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
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
                    <div className="h-1 bg-gradient-to-r from-primary via-success to-primary" />

                    <CardHeader className="text-center pb-2 pt-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                            <motion.div
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Zap className="w-7 h-7 text-white" />
                            </motion.div>
                        </Link>
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>Sign in to your SkillSync account</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 h-12 rounded-xl ${focusedField === 'email' ? 'ring-2 ring-primary' : ''
                                            }`}
                                        error={errors.email}
                                    />
                                </div>
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                className="space-y-2"
                                animate={{ scale: focusedField === 'password' ? 1.01 : 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                className="w-full h-12 text-base rounded-xl hover-lift glow-primary"
                                loading={isLoading}
                            >
                                Sign In
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">or</span>
                            </div>
                        </div>

                        {/* Google Sign In (placeholder) */}
                        <Button variant="outline" className="w-full h-12 rounded-xl hover-lift" disabled>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google (Coming Soon)
                        </Button>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
