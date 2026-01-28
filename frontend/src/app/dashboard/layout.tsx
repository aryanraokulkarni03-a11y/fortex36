import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="md:pl-64 min-h-screen relative">
                {/* Top gradient for depth */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                {/* Content Container */}
                <div className="max-w-7xl mx-auto p-8 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
