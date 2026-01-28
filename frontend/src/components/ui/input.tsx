import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-smooth file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-ring disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-danger focus:ring-danger'
                            : 'border-border hover:border-primary/50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-danger" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
