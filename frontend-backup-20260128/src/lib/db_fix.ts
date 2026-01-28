
import mongoose from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var mongoose: { conn: any; promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    const mongoUri = MONGODB_URI as string;

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
