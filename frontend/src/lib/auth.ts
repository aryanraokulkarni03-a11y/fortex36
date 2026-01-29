
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // 🟢 DEMO MODE BACKDOOR: Ensure Login Works Even if Backend is Down 🟢
                if (
                    credentials.email === "kushaan_parekh@srmap.edu.in" &&
                    credentials.password === "kushaan1234"
                ) {
                    return {
                        id: "demo_user_123",
                        name: "Kushaan Parekh",
                        email: "kushaan_parekh@srmap.edu.in",
                        image: "/avatars/demo.png",
                        accessToken: "demo_token_secure_mock"
                    };
                }

                try {
                    // Call backend to authenticate
                    // Note: This fetch runs on the Next.js server
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials.email, // FastAPI OAuth2PasswordRequestForm expects 'username' usually, but custom schema can use email
                            password: credentials.password
                        })
                    });

                    const data = await res.json();

                    if (res.ok && data.user) {
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            image: data.user.avatar, // Mapping avatar to image
                            accessToken: data.access_token // Custom field
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    }
};
