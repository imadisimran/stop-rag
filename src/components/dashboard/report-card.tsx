"use client"

import { motion } from "framer-motion"
import { FiAlertTriangle, FiCheckCircle, FiEye } from "react-icons/fi"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  DashboardReport,
  DashboardReportStatus,
  DashboardSeverity,
} from "@/lib/dashboard-data"

const statusConfig: Record<
  DashboardReportStatus,
  { label: string; variant: "secondary" | "success" | "outline"; pulse?: boolean }
> = {
  accepted: { label: "Accepted", variant: "success" },
  flagged: { label: "Flagged", variant: "secondary", pulse: true },
  review: { label: "Under Review", variant: "outline" },
}

const severityConfig: Record<
  DashboardSeverity,
  { label: string; variant: "destructive" | "tertiary"; icon: typeof FiAlertTriangle }
> = {
  high: { label: "High Severity", variant: "destructive", icon: FiAlertTriangle },
  medium: { label: "Medium Severity", variant: "tertiary", icon: FiAlertTriangle },
  low: { label: "Low Severity", variant: "tertiary", icon: FiEye },
}

export function ReportCard({
  report,
  index = 0,
}: {
  report: DashboardReport
  index?: number
}) {
  const status = statusConfig[report.status]
  const severity = severityConfig[report.severity]
  const SeverityIcon = report.status === "review" ? FiEye : severity.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass-card p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-5 md:gap-6 cursor-pointer group",
        report.status === "review" && "opacity-80 hover:opacity-100"
      )}
    >
      {/* Icon avatar */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform",
            report.status === "flagged" &&
              "bg-destructive/10 text-destructive border-destructive/20",
            report.status === "accepted" &&
              "bg-success/10 text-success border-success/20",
            report.status === "review" &&
              "bg-muted/40 text-muted-foreground border-white/10"
          )}
        >
          <SeverityIcon className="text-xl md:text-2xl" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            {report.refId}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            {report.date}
          </span>
        </div>
        <h4 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {report.title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {report.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-2">
        <Badge
          variant={status.variant}
          className={cn(
            "uppercase tracking-wider text-[10px] font-bold",
            status.pulse && "flex items-center gap-1.5"
          )}
        >
          {status.pulse && (
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          )}
          {status.label}
        </Badge>
        <Badge
          variant={severity.variant}
          className="uppercase tracking-wider text-[10px] font-bold"
        >
          {severity.label}
        </Badge>
      </div>
    </motion.article>
  )
}
