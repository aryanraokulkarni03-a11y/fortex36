"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Mail, Sparkles, Lock, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Only allow specific credentials
        if (email !== "kushaan_parekh@srmap.edu.in") {
            setError("Invalid email. Please use valid credentials.");
            return;
        }
        if (password !== "kushaan1234") {
            setError("Invalid password. Please use valid credentials.");
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
            {/* Background Effects - Subtle */}
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-20 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
            </Link>

            {/* Main Container - Login Box Centered, Note positioned to the left */}
            <div className="relative z-10 flex items-center justify-center px-4">
                {/* Trial Credentials Note - Positioned absolutely to the left of center */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden lg:block absolute right-[calc(50%+260px)]"
                >
                    <div className="w-64 bg-[#FFF9E6] rounded-lg shadow-lg p-6 border border-[#E8DFC0]">
                        {/* Note header */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8DFC0]">
                            <FileText className="w-4 h-4 text-[#8B7355]" />
                            <span className="text-sm font-medium text-[#8B7355]">Trial Credentials</span>
                        </div>
                        {/* Note content */}
                        <div className="space-y-3 text-[#5D4E37]">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[#8B7355]">Email ID</p>
                                <p className="text-sm font-mono mt-1 break-all">kushaan_parekh@srmap.edu.in</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[#8B7355]">Password</p>
                                <p className="text-sm font-mono mt-1">kushaan1234</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Login Form - Centered */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                        </div>
                    </div>

                    <Card className="glass border-border rounded-xl">
                        <CardHeader className="text-center pb-2 pt-8 px-8">
                            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back!</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground/70">
                                Sign in with your <span className="text-primary">SRM AP</span> email to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 px-8 pb-8">
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="yourname@srmap.edu.in"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 py-5 bg-secondary/50 border-border focus:border-primary/40 focus:ring-0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 py-5 bg-secondary/50 border-border focus:border-primary/40 focus:ring-0"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#1A1A1A] hover:bg-[#232323] border border-primary/35 text-primary py-5"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Continue with SRM Email
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <GraduationCap className="w-4 h-4 text-primary" />
                                    <span>Exclusive for SRM AP Students</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>

                    {/* Mobile Trial Credentials */}
                    <div className="lg:hidden mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Trial Credentials:</p>
                        <p className="text-sm font-mono">kushaan_parekh@srmap.edu.in</p>
                        <p className="text-sm font-mono">kushaan1234</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
