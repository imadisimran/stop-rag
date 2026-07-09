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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitAppeal } from "@/actions/appeal/appeal"
import { FiSend } from "react-icons/fi"
import { useRouter } from "next/navigation"

export function AppealButton({ postId }: { postId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleAppeal = async () => {
    if (!note || !note.trim()) {
      toast.error("Please enter a reason for the appeal")
      return
    }
    setSubmitting(true)
    const toastId = toast.loading("Submitting appeal...")
    try {
      const res = await submitAppeal(postId, note)
      if (res.success) {
        toast.success("Appeal submitted successfully", { id: toastId })
        setIsOpen(false)
        setNote("")
        router.refresh() // Refresh page to reflect new status
      } else {
        toast.error(res.message || "Failed to submit appeal", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="gradient"
        size="sm"
        className="rounded-xl text-[11px] h-8 px-4 font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/20"
      >
        <FiSend className="w-3 h-3" />
        Appeal Decision
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border border-white/10 bg-popover/95 backdrop-blur-md text-white rounded-2xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-gradient">Submit Appeal</DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs leading-normal">
              Provide a clear reason and details on why this decision should be reviewed. You can only appeal this decision once.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe why you believe the verification verdict was incorrect..."
              className="w-full min-h-[100px] border border-white/10 rounded-xl bg-white/5 text-sm p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white"
              maxLength={1000}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2 border-t border-white/5 pt-4">
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => {
                setIsOpen(false)
                setNote("")
              }}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              disabled={submitting}
              onClick={handleAppeal}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Appeal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
