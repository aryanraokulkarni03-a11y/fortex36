import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

// Groq initialized lazily inside handler

// POST /api/ai/recommend - Get AI-powered recommendations
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { type, context } = body;

        if (!type || !context) {
            return NextResponse.json(
                { error: "type and context are required" },
                { status: 400 }
            );
        }

        let prompt = "";

        switch (type) {
            case "career_path":
                prompt = `You are a career advisor for college students. Based on the following skills, suggest 3 potential career paths with brief explanations (2-3 sentences each).

Skills: ${context.skills?.join(", ") || "None specified"}
Year: ${context.year || "Unknown"}
Branch: ${context.branch || "Unknown"}

Respond in JSON format:
{
  "paths": [
    {"title": "Career Title", "description": "Brief explanation", "matchScore": 85}
  ]
}`;
                break;

            case "learn_next":
                prompt = `You are a learning advisor for college students. Based on the skills they already know, suggest 3 skills they should learn next to advance their career.

Current Skills: ${context.currentSkills?.join(", ") || "None"}
Career Interest: ${context.interest || "Tech"}

Respond in JSON format:
{
  "suggestions": [
    {"skill": "Skill Name", "reason": "Why this skill", "priority": "high|medium|low"}
  ]
}`;
                break;

            case "match_summary":
                prompt = `You are helping students connect for peer learning. Write a brief, friendly 2-sentence summary explaining why this mentor is a good match.

Seeker wants to learn: ${context.skill}
Mentor: ${context.mentorName} (Year ${context.mentorYear}, ${context.mentorBranch})
Match Score: ${context.matchScore}%
Connection: ${context.connectionDegree} degree connection
Mutual Exchange: ${context.mutualExchange || "None"}

Keep it casual and encouraging, like a friend recommending someone.`;
                break;

            case "skill_gap":
                prompt = `Analyze the skill gap for this student and provide actionable advice.

Current Skills: ${context.currentSkills?.join(", ") || "None"}
Target Role: ${context.targetRole || "Software Developer"}

Provide 3 specific skills they should focus on, with learning resources.

Respond in JSON format:
{
  "gaps": [
    {"skill": "Skill Name", "priority": "high|medium|low", "resources": ["Resource 1", "Resource 2"]}
  ]
}`;
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid recommendation type" },
                    { status: 400 }
                );
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build",
        });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant for SkillSync, a peer learning platform for SRM AP students. Be encouraging, practical, and concise.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content || "";

        // Try to parse as JSON if expected
        if (type !== "match_summary") {
            try {
                const jsonResponse = JSON.parse(responseText);
                return NextResponse.json(jsonResponse);
            } catch {
                return NextResponse.json({ text: responseText });
            }
        }

        return NextResponse.json({ summary: responseText });
    } catch (error) {
        console.error("Error getting AI recommendation:", error);
        return NextResponse.json(
            { error: "Failed to get recommendation" },
            { status: 500 }
        );
    }
}
