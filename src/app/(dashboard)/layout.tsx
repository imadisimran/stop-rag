import { GlowBackground } from "@/components/layout/glow-background"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Background glow orbs */}
      <GlowBackground />

      {/* Sidebar (desktop) */}
      <DashboardSidebar />

      {/* Top bar */}
      <DashboardTopbar />

      {/* Main content: offset for sidebar + top bar */}
      <div className="lg:ml-64 pt-16 md:pt-20 min-h-screen max-w-[1440px] mx-auto">
        <main className="px-5 md:px-10 py-8 md:py-10 pb-28 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardMobileNav />
    </>
  )
}
