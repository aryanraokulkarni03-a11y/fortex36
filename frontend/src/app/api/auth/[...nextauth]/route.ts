import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// SRM AP email domain validation
const ALLOWED_EMAIL_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "srmap.edu.in";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],

    callbacks: {
        // Validate email domain before sign in
        async signIn({ user }) {
            const email = user.email?.toLowerCase();

            if (!email) {
                return false;
            }

            // Check if email ends with allowed domain
            if (!email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) {
                return `/auth/error?error=InvalidEmail&domain=${ALLOWED_EMAIL_DOMAIN}`;
            }

            return true;
        },

        // Add user data to session
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // Add additional user fields from database if needed
            }
            return session;
        },

        // Add user id to JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },

    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    jwt: {
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
