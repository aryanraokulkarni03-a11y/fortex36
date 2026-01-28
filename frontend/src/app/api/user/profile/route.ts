import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, User, UserSkill } from "@/lib/db";

// GET /api/user/profile - Get current user's profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get user skills
        const skills = await UserSkill.find({ userId: session.user.id })
            .populate("skillId");

        return NextResponse.json({
            ...user.toObject(),
            skills,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// PATCH /api/user/profile - Update current user's profile
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { name, year, branch, bio, image } = body;

        // Validate year if provided
        if (year !== undefined && (year < 1 || year > 4)) {
            return NextResponse.json(
                { error: "Year must be between 1 and 4" },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (year) updateData.year = year;
        if (branch) updateData.branch = branch;
        if (bio !== undefined) updateData.bio = bio;
        if (image) updateData.image = image;

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}

// POST /api/user/profile - Complete profile setup (after first login)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { name, year, branch, bio } = body;

        if (!name || !year || !branch) {
            return NextResponse.json(
                { error: "name, year, and branch are required" },
                { status: 400 }
            );
        }

        if (year < 1 || year > 4) {
            return NextResponse.json(
                { error: "Year must be between 1 and 4" },
                { status: 400 }
            );
        }

        // Check if user already has a profile
        let user = await User.findById(session.user.id);

        if (user && user.year && user.branch) {
            return NextResponse.json(
                { error: "Profile already exists, use PATCH to update" },
                { status: 409 }
            );
        }

        user = await User.findByIdAndUpdate(
            session.user.id,
            {
                $set: {
                    name,
                    year,
                    branch,
                    bio: bio || "",
                },
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Error creating profile:", error);
        return NextResponse.json(
            { error: "Failed to create profile" },
            { status: 500 }
        );
    }
}
