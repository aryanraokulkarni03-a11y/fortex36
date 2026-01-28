// Seed script for initial skills data
// Run with: npx tsx src/scripts/seed.ts

import { connectDB, Skill } from "../lib/db";

const INITIAL_SKILLS = [
    // Programming Languages
    { name: "python", category: "Programming" },
    { name: "javascript", category: "Programming" },
    { name: "typescript", category: "Programming" },
    { name: "java", category: "Programming" },
    { name: "c++", category: "Programming" },
    { name: "c", category: "Programming" },
    { name: "go", category: "Programming" },
    { name: "rust", category: "Programming" },

    // Frontend
    { name: "react", category: "Frontend" },
    { name: "next.js", category: "Frontend" },
    { name: "vue", category: "Frontend" },
    { name: "angular", category: "Frontend" },
    { name: "tailwind css", category: "Frontend" },
    { name: "html/css", category: "Frontend" },

    // Backend
    { name: "node.js", category: "Backend" },
    { name: "express.js", category: "Backend" },
    { name: "fastapi", category: "Backend" },
    { name: "django", category: "Backend" },
    { name: "flask", category: "Backend" },
    { name: "spring boot", category: "Backend" },

    // AI/ML
    { name: "machine learning", category: "AI/ML" },
    { name: "deep learning", category: "AI/ML" },
    { name: "pytorch", category: "AI/ML" },
    { name: "tensorflow", category: "AI/ML" },
    { name: "nlp", category: "AI/ML" },
    { name: "computer vision", category: "AI/ML" },
    { name: "langchain", category: "AI/ML" },

    // Data
    { name: "data science", category: "Data" },
    { name: "sql", category: "Data" },
    { name: "mongodb", category: "Data" },
    { name: "postgresql", category: "Data" },
    { name: "pandas", category: "Data" },
    { name: "data visualization", category: "Data" },

    // DevOps
    { name: "docker", category: "DevOps" },
    { name: "kubernetes", category: "DevOps" },
    { name: "aws", category: "DevOps" },
    { name: "gcp", category: "DevOps" },
    { name: "ci/cd", category: "DevOps" },
    { name: "linux", category: "DevOps" },

    // Mobile
    { name: "react native", category: "Mobile" },
    { name: "flutter", category: "Mobile" },
    { name: "swift", category: "Mobile" },
    { name: "kotlin", category: "Mobile" },

    // Fundamentals
    { name: "dsa", category: "Fundamentals" },
    { name: "competitive programming", category: "Fundamentals" },
    { name: "system design", category: "Fundamentals" },
    { name: "oops", category: "Fundamentals" },
    { name: "git", category: "Fundamentals" },

    // Design
    { name: "ui/ux design", category: "Design" },
    { name: "figma", category: "Design" },
    { name: "graphic design", category: "Design" },

    // Other
    { name: "blockchain", category: "Web3" },
    { name: "solidity", category: "Web3" },
    { name: "cybersecurity", category: "Security" },
    { name: "ethical hacking", category: "Security" },
];

async function seed() {
    try {
        console.log("🌱 Connecting to database...");
        await connectDB();

        console.log("🌱 Seeding skills...");

        for (const skill of INITIAL_SKILLS) {
            try {
                await Skill.findOneAndUpdate(
                    { name: skill.name },
                    { $set: skill },
                    { upsert: true, new: true }
                );
                console.log(`  ✅ ${skill.name}`);
            } catch (error) {
                console.log(`  ⚠️ ${skill.name} - already exists or error`);
            }
        }

        console.log(`\n✅ Seeded ${INITIAL_SKILLS.length} skills!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();
