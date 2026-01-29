"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    User,
    MessageSquare,
    Search,
    Send,
    ChevronDown,
    X,
    Trash2,
    Reply,
    Pencil,
    Copy
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DefaultAvatar from "@/components/DefaultAvatar";
import ClickableAvatar from "@/components/ClickableAvatar";

const userProfile = {
    name: "Kushaan Parekh",
    avatar: "KP",
    department: "CSE"
};

const getDateLabel = (daysAgo: number): string => {
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
};

const initialConversations = [
    { id: 1, name: "Priya Sharma", avatar: "PS", lastMessage: "Sure! Let's schedule the ML session for tomorrow.", time: "2 min ago", online: true },
    { id: 2, name: "Arjun Reddy", avatar: "AR", lastMessage: "Thanks for the React tips! Really helpful.", time: "1 hour ago", online: true },
    { id: 3, name: "Sneha Gupta", avatar: "SG", lastMessage: "Can we discuss the project requirements?", time: "3 hours ago", online: false },
    { id: 4, name: "Rohit Verma", avatar: "RV", lastMessage: "The workshop was great! See you next week.", time: "Yesterday", online: false },
    { id: 5, name: "Kavya Nair", avatar: "KN", lastMessage: "I'd love to learn TypeScript from you!", time: "2 days ago", online: true }
];

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    daysAgo: number;
    isDeleted?: boolean;
    isDeletedForEveryone?: boolean;
    isEdited?: boolean;
    replyTo?: { text: string; sender: string } | null;
    timestamp?: number;
}

const initialMessagesByConversation: { [key: number]: Message[] } = {
    1: [
        { id: 1, sender: "them", text: "Hey! I saw you're great at React. I'd love to learn from you!", time: "10:30 AM", daysAgo: 0 },
        { id: 2, sender: "me", text: "Hi Priya! Yes, I'd be happy to help. What specific topics are you interested in?", time: "10:32 AM", daysAgo: 0 },
        { id: 3, sender: "them", text: "I'm struggling with hooks and state management. Do you have time this week?", time: "10:35 AM", daysAgo: 0 },
        { id: 4, sender: "me", text: "Absolutely! How about we schedule a session for tomorrow at 4 PM?", time: "10:38 AM", daysAgo: 0 },
        { id: 5, sender: "them", text: "Sure! Let's schedule the ML session for tomorrow.", time: "10:40 AM", daysAgo: 0 },
    ],
    2: [
        { id: 1, sender: "me", text: "Hey Arjun! I heard you're good with Python and Data Science.", time: "2:00 PM", daysAgo: 1 },
        { id: 2, sender: "them", text: "Yes! I've been working on some ML projects. What do you want to learn?", time: "2:15 PM", daysAgo: 1 },
        { id: 3, sender: "me", text: "I'm interested in understanding pandas and data visualization better.", time: "2:20 PM", daysAgo: 1 },
        { id: 4, sender: "them", text: "I can definitely help with that! Also, could you show me some React tips?", time: "2:30 PM", daysAgo: 1 },
        { id: 5, sender: "me", text: "Of course! Let's do a skill exchange session.", time: "2:35 PM", daysAgo: 1 },
        { id: 6, sender: "them", text: "Thanks for the React tips! Really helpful.", time: "11:00 AM", daysAgo: 0 },
    ],
    3: [
        { id: 1, sender: "them", text: "Hi Kushaan! I'm working on a deep learning project and need some frontend help.", time: "9:00 AM", daysAgo: 0 },
        { id: 2, sender: "me", text: "Hey Sneha! What kind of frontend work do you need?", time: "9:30 AM", daysAgo: 0 },
        { id: 3, sender: "them", text: "I need to build a dashboard to visualize my model's predictions.", time: "9:45 AM", daysAgo: 0 },
        { id: 4, sender: "me", text: "That sounds interesting! I can help with React and charting libraries.", time: "10:00 AM", daysAgo: 0 },
        { id: 5, sender: "them", text: "Can we discuss the project requirements?", time: "10:15 AM", daysAgo: 0 },
    ],
    4: [
        { id: 1, sender: "me", text: "Hi Rohit! Thanks for hosting the Spring Boot workshop yesterday.", time: "4:00 PM", daysAgo: 1 },
        { id: 2, sender: "them", text: "Glad you enjoyed it! Did you find the microservices part useful?", time: "4:30 PM", daysAgo: 1 },
        { id: 3, sender: "me", text: "Absolutely! I finally understand how to structure backend services properly.", time: "4:45 PM", daysAgo: 1 },
        { id: 4, sender: "them", text: "Great! Let me know if you want to dive deeper into any topic.", time: "5:00 PM", daysAgo: 1 },
        { id: 5, sender: "them", text: "The workshop was great! See you next week.", time: "5:15 PM", daysAgo: 1 },
    ],
    5: [
        { id: 1, sender: "them", text: "Hey! I noticed you're skilled in TypeScript. I've been wanting to learn it.", time: "11:00 AM", daysAgo: 3 },
        { id: 2, sender: "me", text: "Hi Kavya! Yes, I use TypeScript daily. What's your current experience level?", time: "11:30 AM", daysAgo: 3 },
        { id: 3, sender: "them", text: "I know JavaScript pretty well, but types confuse me sometimes.", time: "10:00 AM", daysAgo: 2 },
        { id: 4, sender: "me", text: "That's a great starting point! The transition is easier than you think.", time: "10:30 AM", daysAgo: 2 },
        { id: 5, sender: "them", text: "I'd love to learn TypeScript from you!", time: "11:00 AM", daysAgo: 2 },
    ]
};

function MessagesPageContent() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const [draftConversation, setDraftConversation] = useState<typeof initialConversations[0] | null>(null);
    const [messagesByConversation, setMessagesByConversation] = useState(initialMessagesByConversation);
    const [newMessage, setNewMessage] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle new conversation from query params
    useEffect(() => {
        const userId = searchParams.get('userId');
        const userName = searchParams.get('userName');
        const userAvatar = searchParams.get('userAvatar');

        if (userId && userName && userAvatar) {
            const existingConv = conversations.find(conv => conv.name === userName);

            if (existingConv) {
                // If conversation exists, just select it and clear draft
                setSelectedConversation(existingConv);
                setDraftConversation(null);
            } else {
                // Create draft conversation (not added to sidebar yet)
                const newConv = {
                    id: parseInt(userId),
                    name: userName,
                    avatar: userAvatar,
                    lastMessage: "Start a conversation",
                    time: "Just now",
                    online: true
                };
                setDraftConversation(newConv);
                setSelectedConversation(newConv);
                // Initialize empty message array for this conversation
                setMessagesByConversation(prev => ({ ...prev, [newConv.id]: [] }));
            }
        }
    }, [searchParams]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesByConversation, selectedConversation]);

    const toggleMenu = (messageId: number) => {
        setOpenMenuId(prev => prev === messageId ? null : messageId);
    };

    const closeMenu = () => setOpenMenuId(null);

    const canDeleteForEveryone = (message: Message): boolean => {
        if (message.sender !== "me") return false;
        if (!message.timestamp) return true;
        return message.timestamp > Date.now() - 30 * 60 * 1000;
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // If there's a draft conversation, add it to the conversations list on first message
        if (draftConversation) {
            setConversations(prev => [draftConversation, ...prev]);
            setDraftConversation(null);
        }

        if (editingMessage) {
            setMessagesByConversation(prev => ({
                ...prev,
                [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
                    msg.id === editingMessage.id ? { ...msg, text: newMessage.trim(), isEdited: true } : msg
                )
            }));
            setEditingMessage(null);
        } else {
            const newMsg: Message = {
                id: Date.now(),
                sender: "me",
                text: newMessage.trim(),
                time: "Just now",
                daysAgo: 0,
                timestamp: Date.now(),
                replyTo: replyingTo ? { text: replyingTo.text, sender: replyingTo.sender } : null
            };
            setMessagesByConversation(prev => ({
                ...prev,
                [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg]
            }));
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id ? { ...conv, lastMessage: newMessage.trim(), time: "Just now" } : conv
            ));
            setReplyingTo(null);
        }
        setNewMessage("");
    };

    const handleDeleteForMe = () => {
        if (messageToDelete) {
            setMessagesByConversation(prev => ({
                ...prev,
                [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
                    msg.id === messageToDelete.id ? { ...msg, isDeleted: true } : msg
                )
            }));
        }
        setShowDeleteModal(false);
        setMessageToDelete(null);
    };

    const handleDeleteForEveryone = () => {
        if (messageToDelete) {
            setMessagesByConversation(prev => ({
                ...prev,
                [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
                    msg.id === messageToDelete.id ? { ...msg, isDeletedForEveryone: true } : msg
                )
            }));
        }
        setShowDeleteModal(false);
        setMessageToDelete(null);
    };

    const handleReply = (message: Message) => {
        setReplyingTo(message);
        closeMenu();
        inputRef.current?.focus();
    };

    const handleEdit = (message: Message) => {
        setEditingMessage(message);
        setNewMessage(message.text);
        closeMenu();
        inputRef.current?.focus();
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        closeMenu();
    };

    const handleDelete = (message: Message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
        closeMenu();
    };

    const getMessagesWithDateSeparators = (messages: Message[]) => {
        const result: { type: 'date' | 'message'; content: string | Message }[] = [];
        let lastDaysAgo: number | null = null;
        messages.forEach((msg) => {
            if (msg.isDeleted) return;
            if (lastDaysAgo !== msg.daysAgo) {
                result.push({ type: 'date', content: getDateLabel(msg.daysAgo) });
                lastDaysAgo = msg.daysAgo;
            }
            result.push({ type: 'message', content: msg });
        });
        return result;
    };

    const currentMessages = messagesByConversation[selectedConversation.id] || [];
    const messagesWithSeparators = getMessagesWithDateSeparators(currentMessages);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 hero-gradient pointer-events-none opacity-50 z-0" />
            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30 z-0" />

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-[#1A1A1A] rounded-xl p-5 w-72 border border-border" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Delete message?</h3>
                        <div className="space-y-1">
                            {messageToDelete && canDeleteForEveryone(messageToDelete) && (
                                <button onClick={handleDeleteForEveryone} className="w-full py-3 px-4 text-left text-red-400 hover:bg-secondary/50 rounded-lg">
                                    Delete for everyone
                                </button>
                            )}
                            <button onClick={handleDeleteForMe} className="w-full py-3 px-4 text-left text-red-400 hover:bg-secondary/50 rounded-lg">
                                Delete for me
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full py-3 px-4 text-left text-muted-foreground hover:bg-secondary/50 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border p-6 flex flex-col z-20">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold"><span className="text-primary">Skill</span><span className="text-foreground">Sync</span></span>
                </Link>

                <nav className="space-y-2">
                    {[
                        { icon: TrendingUp, label: "Dashboard", href: "/dashboard", active: false },
                        { icon: Users, label: "Find Matches", href: "/matches", active: false },
                        { icon: MessageSquare, label: "Messages", href: "/messages", active: true },
                        { icon: Calendar, label: "Events", href: "/events", active: false },
                        { icon: Trophy, label: "Leaderboard", href: "/leaderboard", active: false },
                        { icon: User, label: "Profile", href: "/profile", active: false }
                    ].map((item) => (
                        <Link key={item.label} href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-muted/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <DefaultAvatar size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{userProfile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userProfile.department}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen flex">
                {/* Conversations List */}
                <div className="w-80 border-r border-border glass flex flex-col">
                    <header className="p-4 border-b border-border">
                        <h1 className="text-xl font-bold mb-4">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground outline-none" />
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <div key={conv.id} onClick={() => setSelectedConversation(conv)}
                                className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-border/50 ${selectedConversation.id === conv.id ? "bg-muted/20" : "hover:bg-secondary/30"}`}>
                                <div className="relative">
                                    <ClickableAvatar
                                        userName={conv.name}
                                        returnPath="/messages"
                                        size="md"
                                    />
                                    {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium truncate">{conv.name}</h3>
                                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <header className="p-4 border-b border-border glass flex items-center gap-3">
                        <div className="relative">
                            <ClickableAvatar
                                userName={selectedConversation.name}
                                returnPath="/messages"
                                size="sm"
                            />
                            {selectedConversation.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                        </div>
                        <div>
                            <h2 className="font-semibold">{selectedConversation.name}</h2>
                            <p className="text-sm text-muted-foreground">{selectedConversation.online ? "Online" : "Offline"}</p>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messagesWithSeparators.map((item, index) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${index}`} className="flex items-center justify-center my-4">
                                        <span className="px-3 py-1 text-xs text-muted-foreground bg-secondary/50 rounded-full">{item.content as string}</span>
                                    </div>
                                );
                            }

                            const message = item.content as Message;

                            if (message.isDeletedForEveryone) {
                                return (
                                    <div key={`msg-${message.id}`} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                                        <div className="px-4 py-2 rounded-2xl bg-secondary/30 border border-border/50 italic text-muted-foreground text-sm">
                                            🚫 This message was deleted
                                        </div>
                                    </div>
                                );
                            }

                            const isMyMessage = message.sender === "me";

                            return (
                                <div key={`msg-${message.id}`} className={`flex ${isMyMessage ? "justify-end" : "justify-start"} group relative`}>
                                    {/* Menu trigger - positioned outside the message bubble */}
                                    <div className={`flex items-start gap-1 ${isMyMessage ? "flex-row" : "flex-row-reverse"}`}>
                                        <div className={`max-w-md px-4 py-3 rounded-2xl ${isMyMessage ? "bg-primary text-background rounded-br-md" : "bg-secondary/50 text-foreground rounded-bl-md"}`}>
                                            {message.replyTo && (
                                                <div className={`mb-2 px-3 py-2 rounded-lg text-xs border-l-2 ${isMyMessage ? "bg-background/20 border-background/50" : "bg-secondary/50 border-primary/50"}`}>
                                                    <p className={`font-medium ${isMyMessage ? "text-background/80" : "text-muted-foreground"}`}>
                                                        {message.replyTo.sender === "me" ? "You" : selectedConversation.name}
                                                    </p>
                                                    <p className={`truncate ${isMyMessage ? "text-background/70" : "text-muted-foreground"}`}>{message.replyTo.text}</p>
                                                </div>
                                            )}
                                            <p>{message.text}</p>
                                            <div className={`flex items-center gap-1 text-xs mt-1 ${isMyMessage ? "text-background/70" : "text-muted-foreground"}`}>
                                                <span>{message.time}</span>
                                                {message.isEdited && <span className="italic">· Edited</span>}
                                            </div>
                                        </div>

                                        {/* Dropdown button - always visible when menu open */}
                                        <div className={`relative ${openMenuId === message.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(message.id);
                                                }}
                                                className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Dropdown menu - rendered outside the flex container */}
                                    {openMenuId === message.id && (
                                        <div
                                            className={`absolute ${isMyMessage ? 'right-8' : 'left-8'} top-0 bg-[#1A1A1A] border border-border rounded-lg shadow-2xl z-[70] min-w-[140px] py-1`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={() => handleReply(message)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 flex items-center gap-2">
                                                <Reply className="w-4 h-4" /> Reply
                                            </button>
                                            {isMyMessage && (
                                                <button onClick={() => handleEdit(message)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 flex items-center gap-2">
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </button>
                                            )}
                                            <button onClick={() => handleCopy(message.text)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 flex items-center gap-2">
                                                <Copy className="w-4 h-4" /> Copy
                                            </button>
                                            <button onClick={() => handleDelete(message)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/50 flex items-center gap-2 text-red-400">
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply/Edit Preview */}
                    {(replyingTo || editingMessage) && (
                        <div className="border-t border-border bg-secondary/30 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {replyingTo && <Reply className="w-4 h-4 text-primary" />}
                                    {editingMessage && <Pencil className="w-4 h-4 text-primary" />}
                                    <div>
                                        <p className="text-xs text-primary font-medium">
                                            {replyingTo ? `Replying to ${replyingTo.sender === "me" ? "yourself" : selectedConversation.name}` : "Editing message"}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate max-w-md">{replyingTo?.text || editingMessage?.text}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setReplyingTo(null); setEditingMessage(null); setNewMessage(""); }} className="p-1 hover:bg-secondary/50 rounded-full">
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message Input */}
                    <div className="p-4 border-t border-border glass">
                        <div className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground outline-none"
                            />
                            <button onClick={handleSendMessage} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background hover:bg-primary/90 transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Click outside to close menu */}
            {openMenuId !== null && (
                <div className="fixed inset-0 z-[50]" onClick={closeMenu} />
            )}
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading messages...</div>}>
            <MessagesPageContent />
        </Suspense>
    );
}
