import Image from "next/image";

interface DefaultAvatarProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-20 h-20"
};

export function DefaultAvatar({ size = "md", className = "" }: DefaultAvatarProps) {
    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
            <Image
                src="/default-avatar.png"
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
