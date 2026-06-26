import { GlowBackground } from "@/components/layout/glow-background"
import { ReportTopBar } from "@/components/report/report-top-bar"

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Ambient glow background */}
      <GlowBackground />

      {/* Slim focused top bar (no sidebar / bottom nav) */}
      <ReportTopBar />

      {/* Centered content, independent of the (main) grid */}
      <main className="min-h-screen pt-20 md:pt-24 pb-24 px-5 md:px-10">
        {children}
      </main>
    </>
  )
}
