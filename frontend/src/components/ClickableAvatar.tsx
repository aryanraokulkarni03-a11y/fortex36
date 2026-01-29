"use client";

import { useRouter } from "next/navigation";
import DefaultAvatar from "./DefaultAvatar";
import { getUserByName } from "@/lib/users";

// Current user - can be changed to match logged-in user
const CURRENT_USER_NAME = "Kushaan Parekh";

interface ClickableAvatarProps {
    userName: string;
    returnPath: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function ClickableAvatar({
    userName,
    returnPath,
    size = 'md',
    className = ''
}: ClickableAvatarProps) {
    const router = useRouter();

    // Don't make the current user's avatar clickable
    const isCurrentUser = userName === CURRENT_USER_NAME;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Don't navigate if clicking on own profile
        if (isCurrentUser) return;

        // Look up user from shared database for consistent data
        const user = getUserByName(userName);

        if (user) {
            const params = new URLSearchParams({
                returnPath,
                name: user.name,
                department: user.department,
                year: user.year,
                skillsHave: user.skillsHave.join(','),
                skillsWant: user.skillsWant.join(','),
                rating: user.rating.toString(),
                sessions: user.sessions.toString(),
                ...(user.matchScore !== undefined && { matchScore: user.matchScore.toString() }),
            });
            router.push(`/user/${user.id}?${params.toString()}`);
        }
    };

    // If current user, just render the avatar without click functionality
    if (isCurrentUser) {
        return <DefaultAvatar size={size} className={className} />;
    }

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer rounded-full hover:ring-2 hover:ring-primary/50 transition-all ${className}`}
            type="button"
            aria-label={`View ${userName}'s profile`}
        >
            <DefaultAvatar size={size} />
        </button>
    );
}
