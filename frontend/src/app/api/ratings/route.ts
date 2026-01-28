import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB, Rating, Match, User } from "@/lib/db";

// POST /api/ratings - Submit a rating for a completed session
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        const {
            matchId,
            rateeId,
            teachingScore,
            patienceScore,
            clarityScore,
            punctualityScore,
            comment
        } = body;

        if (!matchId || !rateeId) {
            return NextResponse.json(
                { error: "matchId and rateeId are required" },
                { status: 400 }
            );
        }

        // Validate scores
        const scores = [teachingScore, patienceScore, clarityScore, punctualityScore];
        if (scores.some(s => s < 1 || s > 5)) {
            return NextResponse.json(
                { error: "All scores must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Verify match exists and user is part of it
        const match = await Match.findById(matchId);
        if (!match) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 }
            );
        }

        const userId = session.user.id;
        if (match.seekerId.toString() !== userId && match.mentorId.toString() !== userId) {
            return NextResponse.json(
                { error: "You are not part of this session" },
                { status: 403 }
            );
        }

        // Check if already rated
        const existingRating = await Rating.findOne({
            matchId,
            raterId: userId,
        });

        if (existingRating) {
            return NextResponse.json(
                { error: "You have already rated this session" },
                { status: 409 }
            );
        }

        // Create rating
        const rating = await Rating.create({
            matchId,
            raterId: userId,
            rateeId,
            teachingScore,
            patienceScore,
            clarityScore,
            punctualityScore,
            comment,
        });

        // Update ratee's trust score (simple average calculation)
        const allRatings = await Rating.find({ rateeId });
        const avgScore = allRatings.reduce((sum, r) => {
            return sum + (r.teachingScore + r.patienceScore + r.clarityScore + r.punctualityScore) / 4;
        }, 0) / allRatings.length;

        await User.findByIdAndUpdate(rateeId, {
            trustScore: Math.round(avgScore * 20), // Convert 1-5 to 0-100
            $inc: { totalSessions: 1 },
        });

        return NextResponse.json(rating, { status: 201 });
    } catch (error) {
        console.error("Error submitting rating:", error);
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        );
    }
}

// GET /api/ratings?userId=xxx - Get ratings for a user
export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const ratings = await Rating.find({ rateeId: userId })
            .populate("raterId", "name image")
            .sort({ createdAt: -1 });

        // Calculate averages
        const averages = {
            teaching: 0,
            patience: 0,
            clarity: 0,
            punctuality: 0,
            overall: 0,
        };

        if (ratings.length > 0) {
            const totals = ratings.reduce((acc, r) => ({
                teaching: acc.teaching + r.teachingScore,
                patience: acc.patience + r.patienceScore,
                clarity: acc.clarity + r.clarityScore,
                punctuality: acc.punctuality + r.punctualityScore,
            }), { teaching: 0, patience: 0, clarity: 0, punctuality: 0 });

            averages.teaching = totals.teaching / ratings.length;
            averages.patience = totals.patience / ratings.length;
            averages.clarity = totals.clarity / ratings.length;
            averages.punctuality = totals.punctuality / ratings.length;
            averages.overall = (averages.teaching + averages.patience + averages.clarity + averages.punctuality) / 4;
        }

        return NextResponse.json({
            ratings,
            averages,
            totalRatings: ratings.length,
        });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json(
            { error: "Failed to fetch ratings" },
            { status: 500 }
        );
    }
}
