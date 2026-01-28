import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SkillSync - AI-Powered Peer Learning Network',
  description:
    'Connect with the right peer mentor using AI-powered matching. Master any skill with personalized 1-on-1 learning sessions.',
  keywords: ['peer learning', 'mentorship', 'skills', 'education', 'SRM AP'],
  authors: [{ name: 'SkillSync Team' }],
  openGraph: {
    title: 'SkillSync - AI-Powered Peer Learning Network',
    description: 'Find your perfect peer mentor. Learn any skill.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
