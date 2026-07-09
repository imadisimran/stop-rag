"use client"

import { useState } from "react"
import { FiMoreVertical, FiEye, FiFlag, FiTrash2, FiClock, FiLayers } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { UserReportCardData } from "@/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useReportsContext } from "@/components/providers/reports-provider"
import { deleteReport } from "@/actions/report/report"

interface UnderReviewCardProps {
  report: UserReportCardData
}

function getStatusDetails(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return {
        label: "Awaiting Verification",
        sublabel: "In queue for AI analysis",
        accentBg: "from-amber-500/15 to-transparent",
        pulseColor: "bg-amber-500",
        textColor: "text-amber-400",
        glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
        icon: <FiClock className="w-5 h-5" />,
      }
    case "QUEUED":
      return {
        label: "In Queue",
        sublabel: "Waiting for processing slot",
        accentBg: "from-yellow-500/15 to-transparent",
        pulseColor: "bg-yellow-500",
        textColor: "text-yellow-400",
        glowColor: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
        icon: <FiLayers className="w-5 h-5" />,
      }
    case "PROCESSING":
      return {
        label: "AI Processing",
        sublabel: "Analyzing report content",
        accentBg: "from-primary/20 to-transparent",
        pulseColor: "bg-primary",
        textColor: "text-primary",
        glowColor: "shadow-[0_0_20px_var(--glow-purple)]",
        icon: (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ),
      }
    case "FAILED":
      return {
        label: "Verification Failed",
        sublabel: "Manual review required",
        accentBg: "from-destructive/25 to-transparent",
        pulseColor: "bg-destructive",
        textColor: "text-destructive",
        glowColor: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
        icon: <FiFlag className="w-5 h-5" />,
      }
    default:
      return {
        label: "Under Review",
        sublabel: "Processing your report",
        accentBg: "from-slate-600/15 to-transparent",
        pulseColor: "bg-slate-400",
        textColor: "text-slate-400",
        glowColor: "shadow-[0_0_20px_rgba(148,163,184,0.15)]",
        icon: <FiEye className="w-5 h-5" />,
      }
  }
}

export function UnderReviewCard({ report }: UnderReviewCardProps) {
  const { setReports } = useReportsContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const toastId = toast.loading("Deleting report...")
    try {
      const res = await deleteReport(report.postId)
      if (res.success) {
        toast.success("Report deleted successfully", { id: toastId })
        setReports((prev) => prev.filter((r) => r.postId !== report.postId))
        setIsDeleteOpen(false)
      } else {
        toast.error(res.message || "Failed to delete report", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setIsDeleting(false)
    }
  }

  const statusDetail = getStatusDetails(report.status)
  const timeAgo = report.createdAt
    ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })
    : "N/A"

  return (
    <>
      <GlassPanel className="p-0 border border-white/5 hover:border-primary/20 transition-all duration-300 rounded-2xl flex flex-row h-full overflow-hidden min-h-[180px]">
        {/* ── Left Status Column ── */}
        <div
          className={`relative flex flex-col items-center justify-center gap-3 px-4 py-6 min-w-[120px] w-[120px] bg-gradient-to-b ${statusDetail.accentBg} border-r border-white/5`}
        >
          {/* Subtle pulse/glow */}
          <div className="relative">
            <span className={`absolute inset-0 rounded-full ${statusDetail.pulseColor} opacity-20 animate-ping`} />
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 ${statusDetail.textColor} ${statusDetail.glowColor}`}>
              {statusDetail.icon}
            </div>
          </div>

          {/* Status Label & Sublabel */}
          <div className="text-center">
            <p className={`text-[10px] font-bold uppercase tracking-wider leading-tight ${statusDetail.textColor}`}>
              {statusDetail.label}
            </p>
            <p className="text-[8px] text-muted-foreground/60 mt-1 leading-tight font-sans">
              {statusDetail.sublabel}
            </p>
          </div>

          {/* Incident Type Pill */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
            {report.incidentType}
          </span>
        </div>

        {/* ── Right Content Column ── */}
        <div className="flex flex-col flex-1 p-5 relative z-10 bg-white/[0.01]">
          {/* Top row: Post ID + Timestamp + Actions dropdown */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">Post ID:</span>
                <span className="font-mono text-[10px] text-white/90 font-bold">{report.postId}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60">
                Submitted {timeAgo}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5 outline-none">
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover/90 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-xl min-w-36"
              >
                <DropdownMenuItem
                  onClick={() => setIsDeleteOpen(true)}
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer text-destructive hover:text-destructive focus:bg-destructive/10 focus:text-destructive outline-none"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Delete Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          <div className="flex-1 mb-4">
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 italic border-l border-white/10 pl-3">
              &ldquo;{report.description}&rdquo;
            </p>
          </div>

          {/* Bottom Bar: Action Buttons & Live Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDetail.pulseColor} animate-pulse`} />
              <span className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                {report.status === "FAILED" ? "Review Required" : "Verification Pending"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-[11px] h-8 px-3 cursor-not-allowed opacity-30"
                disabled
              >
                View Live
              </Button>
              <Link href={`/dashboard/my-reports/${report.postId}`}>
                <Button
                  variant="gradient"
                  size="sm"
                  className="rounded-xl text-[11px] h-8 px-3 cursor-pointer"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border border-white/10 bg-popover/95 backdrop-blur-md text-white rounded-2xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-gradient">
              Delete Report
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-normal">
              Are you sure you want to delete this report? This action is
              permanent and cannot be undone. Any associated files will be
              removed from Cloudinary.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-4">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
