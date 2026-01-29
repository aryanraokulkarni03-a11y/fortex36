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
            alert("Please use valid credentials");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-8 max-w-5xl w-full justify-center">

                {/* Trial Credentials Note - Left Side */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 md:max-w-xs bg-secondary/30 backdrop-blur-md border border-border p-6 rounded-2xl flex flex-col justify-center shadow-xl"
                >
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Trial Access</h3>
                    </div>
                    <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-white/10 font-mono text-sm leading-relaxed">
                        <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1.5">Trial Email ID</p>
                            <p className="text-white font-medium select-all break-all">kushaan_parekh@srmap.edu.in</p>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1.5">Trial Password</p>
                            <p className="text-white font-medium select-all">kushaan1234</p>
                        </div>
                    </div>
                </motion.div>

                {/* Login Form - Right Side */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 max-w-md w-full"
                >
                    <div className="relative">
                        {/* Back Button */}
                        <Link
                            href="/"
                            className="absolute -top-12 left-0 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border/50 text-sm font-medium z-10"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to Home
                        </Link>

                        <Card className="glass border-border rounded-xl shadow-2xl">
                            <CardHeader className="text-center pb-2 pt-8 px-8">
                                <CardTitle className="text-2xl font-bold text-foreground">Welcome Back!</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground/70">
                                    Sign in with your <span className="text-primary">SRM AP</span> email to continue
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 px-8 pb-8">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
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
                                        <label htmlFor="password" className="text-sm font-medium">Password</label>
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
                                                Login with Credentials
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
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

