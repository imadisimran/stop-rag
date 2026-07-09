import { FiEye, FiCheckCircle, FiFlag, FiInfo, FiAlertCircle } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { AppealButton } from "./appeal-button"
import { DeleteButton } from "./delete-button"
import { AdminVerification } from "@/types"

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
    case "PROCESSING":
    case "QUEUED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted/40 text-muted-foreground border border-white/10">
          <FiEye className="w-3.5 h-3.5" />
          Under Review
        </span>
      )
    case "ACCEPTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-success/20 text-success border border-success/30">
          <FiCheckCircle className="w-3.5 h-3.5" />
          Accepted
        </span>
      )
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-destructive/20 text-destructive border border-destructive/30">
          <FiFlag className="w-3.5 h-3.5" />
          Rejected
        </span>
      )
    case "APPEALED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
          <FiInfo className="w-3.5 h-3.5" />
          Appealed
        </span>
      )
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30">
          <FiAlertCircle className="w-3.5 h-3.5" />
          Failed
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-muted/40 text-muted-foreground border border-white/10">
          {status}
        </span>
      )
  }
}

interface StatusBannerProps {
  status: string
  postId: string
  adminVerification: AdminVerification | null | undefined
}

export function StatusBanner({ status, postId, adminVerification }: StatusBannerProps) {
  return (
    <GlassPanel className="p-5 rounded-2xl border border-white/5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">Report Verification Status:</span>
          {getStatusBadge(status)}
        </div>
        <div className="flex items-center gap-2">
          {status === "REJECTED" && !adminVerification?.isAppealed && (
            <AppealButton postId={postId} />
          )}
          <DeleteButton postId={postId} />
        </div>
      </div>
      {status === "APPEALED" && adminVerification?.appealNote && (
        <div className="border-t border-white/5 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-500 mb-1 flex items-center gap-1.5">
            <FiInfo className="w-3.5 h-3.5" /> Your Appeal Note
          </h4>
          <p className="text-sm text-muted-foreground bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3.5 leading-relaxed whitespace-pre-wrap">
            {adminVerification.appealNote}
          </p>
        </div>
      )}
    </GlassPanel>
  )
}
