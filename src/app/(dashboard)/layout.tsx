import { GlowBackground } from "@/components/layout/glow-background"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav"
import { ReportsProvider } from "@/components/providers/reports-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReportsProvider>
      {/* Background glow orbs */}
      <GlowBackground />

      {/* Top bar */}
      <DashboardTopbar />

      {/* Layout: Sidebar + Main Content */}
      <div className="pt-16 md:pt-20 flex min-h-screen max-w-[1440px] mx-auto">
        <DashboardSidebar />
        <main className="flex-1 lg:ml-64 px-5 md:px-10 py-8 md:py-10 pb-28 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardMobileNav />
    </ReportsProvider>
  )
}
