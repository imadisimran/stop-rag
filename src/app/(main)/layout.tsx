import { GlowBackground } from "@/components/layout/glow-background"
import { TopNavbar } from "@/components/layout/top-navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
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
    </>
  )
}
