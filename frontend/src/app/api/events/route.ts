import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB, Event } from "@/lib/db";

// GET /api/events - Get events, optionally filtered by interests
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const tags = searchParams.get("tags")?.split(",");
        const upcoming = searchParams.get("upcoming") === "true";

        // Build query
        const query: Record<string, unknown> = {};

        if (category) {
            query.category = category;
        }

        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        if (upcoming) {
            query.date = { $gte: new Date() };
        }

        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(20);

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// POST /api/events - Create a new event (requires auth)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const { title, description, category, tags, date, location, isOnline, link, organizer, imageUrl } = body;

        if (!title || !description || !category || !date || !organizer) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const event = await Event.create({
            title,
            description,
            category,
            tags: tags || [],
            date: new Date(date),
            location,
            isOnline: isOnline || false,
            link,
            organizer,
            imageUrl,
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}
