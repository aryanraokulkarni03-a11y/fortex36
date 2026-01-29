"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Mail, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.endsWith("@srmap.edu.in")) {
            alert("Please use your SRM AP email (@srmap.edu.in)");
            return;
        }
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            alert("Login failed. Please check your credentials.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
            {/* Background Effects - Subtle */}
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                    </Link>
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
                                <p className="text-xs text-muted-foreground">
                                    Only @srmap.edu.in emails are allowed
                                </p>
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
            </motion.div>
        </div>
    );
}

