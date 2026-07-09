"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { deleteReport } from "@/actions/report/report"
import { FiTrash2 } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { useReportsContext } from "@/components/providers/reports-provider"

export function DeleteButton({ postId }: { postId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { setReports } = useReportsContext()
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    const toastId = toast.loading("Deleting report...")
    try {
      const res = await deleteReport(postId)
      if (res.success) {
        toast.success("Report deleted successfully", { id: toastId })
        setReports((prev) => prev.filter((r) => r.postId !== postId))
        setIsOpen(false)
        router.push("/dashboard/my-reports")
      } else {
        toast.error(res.message || "Failed to delete report", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        size="sm"
        className="rounded-xl text-[11px] h-8 px-4 font-semibold flex items-center gap-1.5 cursor-pointer bg-red-600/10 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300"
      >
        <FiTrash2 className="w-3 h-3" />
        Delete Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              disabled={deleting}
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
