/**
 * Static mock data for the student dashboard.
 * Kept separate from presentation — wire these up to real
 * report queries (see `src/actions/report/report.ts`) later.
 */

export type DashboardReportStatus = "accepted" | "flagged" | "review"
export type DashboardSeverity = "high" | "medium" | "low"

export interface DashboardReport {
  id: string
  refId: string
  date: string
  title: string
  description: string
  status: DashboardReportStatus
  severity: DashboardSeverity
}

/** Pie-chart slices + legend values for the Statistics Overview card. */
export interface ReportStatSlice {
  key: string
  label: string
  value: number
  /** Tailwind-friendly color token name mapped from --chart-* */
  colorVar: string
}

export const reportStats: {
  total: number
  trendDelta: number
  trendDirection: "down" | "up"
  updatedAt: string
  slices: ReportStatSlice[]
} = {
  total: 124,
  trendDelta: 12,
  trendDirection: "down",
  updatedAt: "5 minutes ago",
  slices: [
    { key: "accepted", label: "Accepted", value: 12, colorVar: "var(--chart-1)" },
    { key: "flagged", label: "Flagged", value: 8, colorVar: "var(--chart-2)" },
    { key: "review", label: "Under Review", value: 7, colorVar: "var(--chart-5)" },
  ],
}

export const dashboardReports: DashboardReport[] = [
  {
    id: "1",
    refId: "#REF-8291",
    date: "Oct 24, 2023",
    title: "Verbal harassment in Central Library",
    description:
      "Reported incident involving a group of seniors during evening hours near the east wing study booths...",
    status: "flagged",
    severity: "high",
  },
  {
    id: "2",
    refId: "#REF-8274",
    date: "Oct 21, 2023",
    title: "Attempted cyber-bullying on Discord",
    description:
      "Screenshots provided of threatening messages sent via unofficial student group channel...",
    status: "accepted",
    severity: "medium",
  },
  {
    id: "3",
    refId: "#REF-8255",
    date: "Oct 19, 2023",
    title: "Physical ragging incident at Sports Complex",
    description:
      "Forced physical activities during freshman orientation rehearsals at the football field...",
    status: "review",
    severity: "high",
  },
]

export const dashboardNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Profile", href: "/dashboard/profile", icon: "profile" },
  { label: "My Reports", href: "#", icon: "reports" },
  { label: "Safety Resources", href: "#", icon: "safety" },
  { label: "Emergency", href: "#", icon: "emergency" },
]

