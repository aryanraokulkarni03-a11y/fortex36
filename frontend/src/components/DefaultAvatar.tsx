interface DefaultAvatarProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function DefaultAvatar({ size = 'md', className = '' }: DefaultAvatarProps) {
    const sizeClasses = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    const iconSizes = {
        xs: 20,
        sm: 24,
        md: 28,
        lg: 38,
        xl: 48
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center ${className}`}>
            <svg
                width={iconSizes[size]}
                height={iconSizes[size]}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Head circle */}
                <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="#F4D06F"
                    strokeWidth="1.5"
                    fill="none"
                />
                {/* Body/shoulders path */}
                <path
                    d="M5 20.5C5 17.5 8 15 12 15C16 15 19 17.5 19 20.5"
                    stroke="#F4D06F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}
