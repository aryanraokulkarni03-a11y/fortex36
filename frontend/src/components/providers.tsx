'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState, type ReactNode } from 'react'
import { Toaster } from 'sonner'

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                        retry: 3,
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
            >
                {children}
                <Toaster
                    theme="dark"
                    position="bottom-right"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            background: 'hsl(220, 14%, 12%)',
                            border: '1px solid hsl(220, 12%, 20%)',
                            color: 'hsl(0, 0%, 98%)',
                        },
                    }}
                />
            </ThemeProvider>
        </QueryClientProvider>
    )
}
