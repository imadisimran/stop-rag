"use client"

import { motion } from "framer-motion"
import { FiMoreVertical, FiEye, FiCheckCircle, FiFlag, FiInfo } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserReportCardData } from "@/types"
import { format } from "date-fns"
import Link from "next/link"

interface UserReportCardProps {
  report: UserReportCardData
}

export function UserReportCard({ report }: UserReportCardProps) {
  const isHigh = report.severity === "HIGH"
  const isMedium = report.severity === "MEDIUM"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <GlassPanel className="p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 rounded-2xl flex flex-col justify-between h-full">
        <div>
          {/* Top bar info */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{report.postId}</span>
              <span className="text-xs text-muted-foreground">
                {report.createdAt ? format(new Date(report.createdAt), "MMM dd, yyyy") : "N/A"}
              </span>

              {/* Severity Badge */}
              <Badge
                variant={isHigh ? "destructive" : isMedium ? "tertiary" : "outline"}
                className="uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 rounded-full"
              >
                {report.severity.charAt(0) + report.severity.slice(1).toLowerCase()} Severity
              </Badge>
            </div>

            <button className="text-muted-foreground hover:text-white transition-colors">
              <FiMoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
            {report.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Bottom Stats & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-center gap-4">
            {/* Status badge */}
            {(report.status === "PENDING" || report.status === "PROCESSING" || report.status === "QUEUED") && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 text-muted-foreground border border-white/10">
                <FiEye className="w-3.5 h-3.5" />
                <span className="font-body text-[10px] font-bold uppercase tracking-wider">Under Review</span>
              </div>
            )}

            {report.status === "ACCEPTED" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/20 text-success border border-success/30">
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span className="font-body text-[10px] font-bold uppercase tracking-wider">Accepted</span>
              </div>
            )}

            {report.status === "REJECTED" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/20 text-destructive border border-destructive/30">
                <FiFlag className="w-3.5 h-3.5" />
                <span className="font-body text-[10px] font-bold uppercase tracking-wider">Rejected</span>
              </div>
            )}

            {report.status === "APPEALED" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                <FiInfo className="w-3.5 h-3.5" />
                <span className="font-body text-[10px] font-bold uppercase tracking-wider">Appealed</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/incidents/${report.postId}`}>
              <Button variant="outline" size="sm" className="rounded-xl text-[11px] h-8 px-3 cursor-pointer">
                View Live
              </Button>
            </Link>
            <Link href={`/dashboard/my-reports/${report.postId}`}>
              <Button variant="gradient" size="sm" className="rounded-xl text-[11px] h-8 px-3 cursor-pointer">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}

