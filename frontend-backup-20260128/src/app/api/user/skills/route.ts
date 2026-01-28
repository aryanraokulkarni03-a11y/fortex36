import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, UserSkill, Skill } from "@/lib/db";

// GET /api/user/skills - Get current user's skills
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const userSkills = await UserSkill.find({ userId: session.user.id })
            .populate("skillId")
            .sort({ createdAt: -1 });

        return NextResponse.json(userSkills);
    } catch (error) {
        console.error("Error fetching user skills:", error);
        return NextResponse.json(
            { error: "Failed to fetch user skills" },
            { status: 500 }
        );
    }
}

// POST /api/user/skills - Add a skill to user's profile
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { skillId, proficiency, isTeaching, isLearning } = body;

        if (!skillId || !proficiency) {
            return NextResponse.json(
                { error: "skillId and proficiency are required" },
                { status: 400 }
            );
        }

        if (proficiency < 1 || proficiency > 5) {
            return NextResponse.json(
                { error: "Proficiency must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Check if skill exists
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return NextResponse.json(
                { error: "Skill not found" },
                { status: 404 }
            );
        }

        // Check if user already has this skill
        const existingUserSkill = await UserSkill.findOne({
            userId: session.user.id,
            skillId,
        });

        if (existingUserSkill) {
            // Update existing
            existingUserSkill.proficiency = proficiency;
            existingUserSkill.isTeaching = isTeaching ?? existingUserSkill.isTeaching;
            existingUserSkill.isLearning = isLearning ?? existingUserSkill.isLearning;
            await existingUserSkill.save();
            return NextResponse.json(existingUserSkill);
        }

        // Create new
        const userSkill = await UserSkill.create({
            userId: session.user.id,
            skillId,
            proficiency,
            isTeaching: isTeaching ?? false,
            isLearning: isLearning ?? false,
        });

        return NextResponse.json(userSkill, { status: 201 });
    } catch (error) {
        console.error("Error adding user skill:", error);
        return NextResponse.json(
            { error: "Failed to add skill" },
            { status: 500 }
        );
    }
}

// DELETE /api/user/skills - Remove a skill from user's profile
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(request.url);
        const skillId = searchParams.get("skillId");

        if (!skillId) {
            return NextResponse.json(
                { error: "skillId is required" },
                { status: 400 }
            );
        }

        const result = await UserSkill.deleteOne({
            userId: session.user.id,
            skillId,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Skill not found in your profile" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Skill removed successfully" });
    } catch (error) {
        console.error("Error removing user skill:", error);
        return NextResponse.json(
            { error: "Failed to remove skill" },
            { status: 500 }
        );
    }
}
