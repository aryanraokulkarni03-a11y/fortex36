import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(220, 12%, 20%)",
                input: "hsl(220, 12%, 20%)",
                ring: "hsl(210, 100%, 55%)",
                background: "hsl(220, 15%, 8%)",
                foreground: "hsl(0, 0%, 98%)",
                primary: {
                    DEFAULT: "hsl(210, 100%, 55%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(220, 14%, 12%)",
                    foreground: "hsl(0, 0%, 98%)",
                },
                success: {
                    DEFAULT: "hsl(142, 76%, 55%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                warning: {
                    DEFAULT: "hsl(45, 100%, 60%)",
                    foreground: "hsl(220, 15%, 8%)",
                },
                danger: {
                    DEFAULT: "hsl(348, 86%, 61%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(220, 14%, 12%)",
                    foreground: "hsl(220, 10%, 70%)",
                },
                accent: {
                    DEFAULT: "hsl(280, 85%, 68%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                card: {
                    DEFAULT: "hsl(220, 14%, 12%)",
                    foreground: "hsl(0, 0%, 98%)",
                },
            },
            borderRadius: {
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.375rem",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "slide-down": {
                    "0%": { transform: "translateY(-20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "scale-in": {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                "glow-pulse": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(0, 138, 255, 0.3)" },
                    "50%": { boxShadow: "0 0 30px rgba(0, 138, 255, 0.5)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "slide-up": "slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "slide-down": "slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "scale-in": "scale-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "glow-pulse": "glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [],
};

export default config;
