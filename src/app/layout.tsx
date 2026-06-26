import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
import { GlowBackground } from "@/components/layout/glow-background"
import { TopNavbar } from "@/components/layout/top-navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "STOPRAG | Fearless Anti-Ragging Platform",
  description:
    "Browse reported incidents across campuses. Your identity remains protected by end-to-end encryption.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased font-body overflow-x-hidden">
        {/* Background glow orbs */}
        <GlowBackground />

        {/* Top Navigation */}
        <TopNavbar />

        {/* Layout: Sidebar + Main Content */}
        <div className="pt-16 md:pt-20 flex min-h-screen max-w-[1440px] mx-auto">
          <Sidebar />
          <main className="flex-1 lg:ml-64 px-5 md:px-10 py-8 md:py-10 pb-28 lg:pb-10">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Toast Notifications */}
        <Toaster />
      </body>
    </html>
  )
}