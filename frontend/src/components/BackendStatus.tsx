/**
 * Backend Status Indicator
 * Shows connection status to the backend API
 */

'use client';

import { useData } from './DataProvider';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackendStatusProps {
    className?: string;
    minimal?: boolean;
}

export function BackendStatus({ className, minimal = false }: BackendStatusProps) {
    const { backendConnected, loading, error, refreshData } = useData();

    if (minimal) {
        return (
            <div
                className={cn(
                    'w-2 h-2 rounded-full',
                    backendConnected ? 'bg-green-500' : 'bg-yellow-500',
                    className
                )}
                title={backendConnected ? 'Backend connected' : 'Using demo data'}
            />
        );
    }

    return (
        <div className={cn('flex items-center gap-2 text-sm', className)}>
            {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : backendConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
            ) : (
                <WifiOff className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-muted-foreground">
                {loading
                    ? 'Connecting...'
                    : backendConnected
                        ? 'Live'
                        : 'Demo mode'}
            </span>
            {error && !loading && (
                <button
                    onClick={() => refreshData()}
                    className="text-xs text-primary hover:underline"
                >
                    Retry
                </button>
            )}
        </div>
    );
}

export default BackendStatus;
