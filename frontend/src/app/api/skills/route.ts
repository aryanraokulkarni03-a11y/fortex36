import { NextResponse } from "next/server";
import { connectDB, Skill } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/skills - Create a new skill (admin only in production)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { name, category, icon } = body;

        if (!name || !category) {
            return NextResponse.json(
                { error: "Name and category are required" },
                { status: 400 }
            );
        }

        // Check if skill already exists
        const existingSkill = await Skill.findOne({ name: name.toLowerCase() });
        if (existingSkill) {
            return NextResponse.json(
                { error: "Skill already exists" },
                { status: 409 }
            );
        }

        const skill = await Skill.create({
            name: name.toLowerCase(),
            category,
            icon,
        });

        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error("Error creating skill:", error);
        return NextResponse.json(
            { error: "Failed to create skill" },
            { status: 500 }
        );
    }
}
