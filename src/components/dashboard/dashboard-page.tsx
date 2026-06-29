import { DashboardHeader } from "./dashboard-header"
import { StatsGrid } from "./stats-grid"
import { MyReports } from "./my-reports"

export function DashboardPage() {
  return (
    <div className="space-y-0">
      <DashboardHeader />
      <StatsGrid />
      <MyReports />
    </div>
  )
}
