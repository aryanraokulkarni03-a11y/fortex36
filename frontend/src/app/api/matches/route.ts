import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB, UserSkill, User } from "@/lib/db";

const GRAPHRAG_URL = process.env.GRAPHRAG_URL || "http://localhost:8000";

// POST /api/matches/find - Find peer matches for a skill
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { skillName, limit = 5 } = body;

        if (!skillName) {
            return NextResponse.json(
                { error: "skillName is required" },
                { status: 400 }
            );
        }

        // Call GraphRAG microservice
        const response = await fetch(`${GRAPHRAG_URL}/match/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: session.user.id,
                skill_name: skillName,
                limit,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error.detail || "Failed to find matches" },
                { status: response.status }
            );
        }

        const matches = await response.json();
        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error finding matches:", error);
        return NextResponse.json(
            { error: "Failed to find matches" },
            { status: 500 }
        );
    }
}

// GET /api/matches - Get user's match history
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Import Match model here to avoid circular deps
        const { Match } = await import("@/lib/db");

        const matches = await Match.find({
            $or: [
                { seekerId: session.user.id },
                { mentorId: session.user.id },
            ],
        })
            .populate("seekerId", "name email image year branch")
            .populate("mentorId", "name email image year branch")
            .populate("skillId", "name category")
            .sort({ createdAt: -1 });

        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        return NextResponse.json(
            { error: "Failed to fetch matches" },
            { status: 500 }
        );
    }
}
