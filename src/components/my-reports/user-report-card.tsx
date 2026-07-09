"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMoreVertical, FiCheckCircle, FiFlag, FiInfo, FiTrash2, FiSend } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserReportCardData } from "@/types"
import { format } from "date-fns"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useReportsContext } from "@/components/providers/reports-provider"
import { deleteReport } from "@/actions/report/report"
import { submitAppeal } from "@/actions/appeal/appeal"
import { UnderReviewCard } from "./under-review-card"

function getStatusDetails(status: string) {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return {
        label: "Accepted",
        bgClass: "bg-success/20 text-success border-success/30",
        icon: <FiCheckCircle className="w-3.5 h-3.5" />,
      }
    case "REJECTED":
      return {
        label: "Rejected",
        bgClass: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <FiFlag className="w-3.5 h-3.5" />,
      }
    case "APPEALED":
      return {
        label: "Appealed",
        bgClass: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        icon: <FiInfo className="w-3.5 h-3.5" />,
      }
    default:
      return null
  }
}

interface UserReportCardProps {
  report: UserReportCardData
}

export function UserReportCard({ report }: UserReportCardProps) {
  const isHigh = report.severity === "HIGH"
  const isMedium = report.severity === "MEDIUM"

  const { setReports } = useReportsContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAppealOpen, setIsAppealOpen] = useState(false)
  const [appealNote, setAppealNote] = useState("")
  const [isAppealing, setIsAppealing] = useState(false)

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

  const handleAppeal = async () => {
    if (!appealNote || !appealNote.trim()) {
      toast.error("Please enter a reason for the appeal")
      return
    }
    setIsAppealing(true)
    const toastId = toast.loading("Submitting appeal...")
    try {
      const res = await submitAppeal(report.postId, appealNote)
      if (res.success) {
        toast.success("Appeal submitted successfully", { id: toastId })
        setReports((prev) =>
          prev.map((r) =>
            r.postId === report.postId
              ? { ...r, status: "APPEALED", isAppealed: true }
              : r
          )
        )
        setIsAppealOpen(false)
        setAppealNote("")
      } else {
        toast.error(res.message || "Failed to submit appeal", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setIsAppealing(false)
    }
  }

  const isUnderReviewOrFailed = ["PENDING", "PROCESSING", "QUEUED", "FAILED"].includes(report.status)
  const statusDetail = getStatusDetails(report.status)

  if (isUnderReviewOrFailed) {
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
        <UnderReviewCard report={report} />
      </motion.div>
    )
  }

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5 outline-none">
                  <FiMoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-xl min-w-36">
                {report.status === "REJECTED" && !report.isAppealed && (
                  <DropdownMenuItem
                    onClick={() => setIsAppealOpen(true)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer text-muted-foreground hover:text-white focus:bg-white/5 focus:text-white outline-none"
                  >
                    <FiSend className="w-3.5 h-3.5 text-primary" />
                    Appeal Decision
                  </DropdownMenuItem>
                )}
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
            {statusDetail && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${statusDetail.bgClass}`}>
                {statusDetail.icon}
                <span className="font-body text-[10px] font-bold uppercase tracking-wider">{statusDetail.label}</span>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border border-white/10 bg-popover/95 backdrop-blur-md text-white rounded-2xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-gradient">Delete Report</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-normal">
              Are you sure you want to delete this report? This action is permanent and cannot be undone. Any associated files will be removed from Cloudinary.
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

      {/* Appeal Dialog */}
      <Dialog open={isAppealOpen} onOpenChange={setIsAppealOpen}>
        <DialogContent className="border border-white/10 bg-popover/95 backdrop-blur-md text-white rounded-2xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-gradient">Submit Appeal</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-normal">
              Provide a clear reason and details on why this decision should be reviewed. You can only appeal this decision once.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Textarea
              value={appealNote}
              onChange={(e) => setAppealNote(e.target.value)}
              placeholder="Describe why you believe the verification verdict was incorrect..."
              className="w-full min-h-[100px] border border-white/10 rounded-xl bg-white/5 text-sm p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white animate-gsap-textarea"
              maxLength={1000}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 border-t border-white/5 pt-4">
            <Button
              variant="outline"
              disabled={isAppealing}
              onClick={() => {
                setIsAppealOpen(false)
                setAppealNote("")
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              disabled={isAppealing}
              onClick={handleAppeal}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              {isAppealing ? "Submitting..." : "Submit Appeal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
