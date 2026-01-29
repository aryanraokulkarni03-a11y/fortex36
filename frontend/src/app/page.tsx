"use client";

import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Network,
  Mic,
  ArrowRight,
  GraduationCap,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const features = [
  {
    icon: Network,
    title: "Smart Matching",
    description: "AI-powered GraphRAG finds your perfect learning partner based on skills and interests"
  },
  {
    icon: Users,
    title: "Connection Degrees",
    description: "See how you're connected - 1st, 2nd, or 3rd degree - just like LinkedIn"
  },
  {
    icon: Mic,
    title: "Voice Search",
    description: "Just say \"Find ML mentors\" and watch the magic happen"
  },
  {
    icon: Target,
    title: "Skill DNA",
    description: "Beautiful visualization of your skills - shareable on Instagram!"
  }
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Skills" },
  { value: "94%", label: "Match Rate" },
  { value: "2.5K", label: "Sessions" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects - Subtle */}
      <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            <a href="#features" className="text-primary hover:text-primary/80 transition-colors">Features</a>
            <a href="#how-it-works" className="text-primary hover:text-primary/80 transition-colors">How it Works</a>
            <a href="#stats" className="text-primary hover:text-primary/80 transition-colors">Stats</a>
          </div>

          <div className="flex-1">
            {/* Empty for symmetry */}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="mb-8 px-4 py-2 border-border bg-muted text-primary">
                <Zap className="w-3 h-3 mr-2" />
                Exclusive for SRM AP Students
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-semibold mb-8 leading-[1.15]"
            >
              Find Your Perfect
              <br />
              <span className="text-primary">Learning Partner</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground/75 mb-12 max-w-2xl mx-auto"
            >
              10,000 students. Endless skills. One platform.
              <br />
              SkillSync uses AI to match you with the right mentor or study buddy.
            </motion.p>

            <motion.div variants={fadeIn} className="flex justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-[#1A1A1A] hover:bg-[#232323] border border-primary/35 text-primary text-lg px-8 py-6">
                  Start Learning
                  <GraduationCap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2 border-border bg-muted text-primary">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">SkillSync</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI to make peer learning effortless and effective
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-8 card-hover group"
              >
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2 border-border bg-muted text-primary">
              How it Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              3 Steps to <span className="text-primary">Start Learning</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Use your SRM email (@srmap.edu.in) to create your account", icon: GraduationCap },
              { step: "02", title: "Add Skills", desc: "Tell us what you know and what you want to learn", icon: TrendingUp },
              { step: "03", title: "Get Matched", desc: "Our AI finds your perfect learning partner", icon: Sparkles }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-8 text-center card-hover h-full">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Find Your <span className="text-primary">Learning Partner</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of SRM AP students already learning together
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-[#1A1A1A] hover:bg-[#232323] border border-primary/35 text-primary text-lg px-12 py-6">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 SkillSync. Made with ❤️ for SRM AP Hackathon
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

