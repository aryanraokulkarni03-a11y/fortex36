import mongoose, { Schema, Document, Model } from "mongoose";

// ============== USER SCHEMA ==============
export interface IUser extends Document {
    email: string;
    name: string;
    image?: string;
    year: number; // 1, 2, 3, 4
    branch: string; // CSE, ECE, etc.
    bio?: string;
    trustScore: number; // 0-100
    totalSessions: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (email: string) => email.endsWith("@srmap.edu.in"),
                message: "Only SRM AP email addresses are allowed",
            },
        },
        name: { type: String, required: true },
        image: { type: String },
        year: { type: Number, required: true, min: 1, max: 4 },
        branch: { type: String, required: true },
        bio: { type: String, maxlength: 500 },
        trustScore: { type: Number, default: 50, min: 0, max: 100 },
        totalSessions: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// ============== SKILL SCHEMA ==============
export interface ISkill extends Document {
    name: string;
    category: string;
    icon?: string;
}

const SkillSchema = new Schema<ISkill>({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    icon: { type: String },
});

// ============== USER SKILL SCHEMA ==============
export interface IUserSkill extends Document {
    userId: mongoose.Types.ObjectId;
    skillId: mongoose.Types.ObjectId;
    proficiency: number; // 1-5
    isTeaching: boolean;
    isLearning: boolean;
    createdAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
        proficiency: { type: Number, required: true, min: 1, max: 5 },
        isTeaching: { type: Boolean, default: false },
        isLearning: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compound index for unique user-skill combinations
UserSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

// ============== MATCH/SESSION SCHEMA ==============
export interface IMatch extends Document {
    seekerId: mongoose.Types.ObjectId;
    mentorId: mongoose.Types.ObjectId;
    skillId: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "completed" | "cancelled";
    matchScore: number;
    connectionDegree: number; // 1, 2, 3
    scheduledAt?: Date;
    completedAt?: Date;
    createdAt: Date;
}

const MatchSchema = new Schema<IMatch>(
    {
        seekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        mentorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
        status: {
            type: String,
            enum: ["pending", "accepted", "completed", "cancelled"],
            default: "pending",
        },
        matchScore: { type: Number, required: true },
        connectionDegree: { type: Number, required: true, min: 1, max: 3 },
        scheduledAt: { type: Date },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

// ============== RATING SCHEMA ==============
export interface IRating extends Document {
    matchId: mongoose.Types.ObjectId;
    raterId: mongoose.Types.ObjectId;
    rateeId: mongoose.Types.ObjectId;
    teachingScore: number; // 1-5
    patienceScore: number; // 1-5
    clarityScore: number; // 1-5
    punctualityScore: number; // 1-5
    comment?: string;
    createdAt: Date;
}

const RatingSchema = new Schema<IRating>(
    {
        matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
        raterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rateeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        teachingScore: { type: Number, required: true, min: 1, max: 5 },
        patienceScore: { type: Number, required: true, min: 1, max: 5 },
        clarityScore: { type: Number, required: true, min: 1, max: 5 },
        punctualityScore: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
    },
    { timestamps: true }
);

// ============== EVENT SCHEMA ==============
export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    tags: string[];
    date: Date;
    location?: string;
    isOnline: boolean;
    link?: string;
    organizer: string;
    imageUrl?: string;
    createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        tags: [{ type: String }],
        date: { type: Date, required: true },
        location: { type: String },
        isOnline: { type: Boolean, default: false },
        link: { type: String },
        organizer: { type: String, required: true },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

// ============== REPORT SCHEMA ==============
export interface IReport extends Document {
    reporterId: mongoose.Types.ObjectId;
    reportedUserId: mongoose.Types.ObjectId;
    reason: string;
    description: string;
    status: "pending" | "reviewed" | "resolved" | "dismissed";
    createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reportedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        description: { type: String, required: true, maxlength: 1000 },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// ============== MODEL EXPORTS ==============
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const Skill: Model<ISkill> =
    mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export const UserSkill: Model<IUserSkill> =
    mongoose.models.UserSkill || mongoose.model<IUserSkill>("UserSkill", UserSkillSchema);

export const Match: Model<IMatch> =
    mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);

export const Rating: Model<IRating> =
    mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);

export const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export const Report: Model<IReport> =
    mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

// ============== DB CONNECTION ==============
const MONGODB_URI = process.env.MONGODB_URI;

// Avoid 'any' type for global
declare global {
    // eslint-disable-next-line no-var
    var mongoose: { conn: any; promise: any } | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    const mongoUri = MONGODB_URI;

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!mongoUri) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }

    if (!cached!.promise) {
        cached!.promise = mongoose.connect(mongoUri).then((mongoose) => mongoose);
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}
