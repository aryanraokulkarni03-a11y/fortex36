"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ActivityEvent {
    id: string;
    type: "skill_added" | "match_created" | "session_completed" | "user_joined";
    userId: string;
    userName: string;
    userImage?: string;
    payload: Record<string, unknown>;
    timestamp: Date;
}

interface UseRealtimeOptions {
    url?: string;
    roomId?: string;
}

interface RealtimeHook {
    isConnected: boolean;
    activities: ActivityEvent[];
    onlineCount: number;
    emit: (event: string, data: unknown) => void;
}

export function useRealtime(options: UseRealtimeOptions = {}): RealtimeHook {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activities, setActivities] = useState<ActivityEvent[]>([]);
    const [onlineCount, setOnlineCount] = useState(0);

    const { url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", roomId = "global" } = options;

    useEffect(() => {
        const socketInstance = io(url, {
            transports: ["websocket", "polling"],
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
            socketInstance.emit("join_room", roomId);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        socketInstance.on("activity", (event: ActivityEvent) => {
            setActivities((prev) => [event, ...prev].slice(0, 50)); // Keep last 50
        });

        socketInstance.on("online_count", (count: number) => {
            setOnlineCount(count);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [url, roomId]);

    const emit = useCallback(
        (event: string, data: unknown) => {
            if (socket && isConnected) {
                socket.emit(event, data);
            }
        },
        [socket, isConnected]
    );

    return {
        isConnected,
        activities,
        onlineCount,
        emit,
    };
}
