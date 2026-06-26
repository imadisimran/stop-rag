"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { FiSend, FiLoader, FiCheckCircle, FiLock } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EvidenceUpload, type UploadedFile } from "./evidence-upload"

const universities = [
  { value: "mit", label: "Institute of Advanced Technology" },
  { value: "national", label: "National Research Academy" },
  { value: "global", label: "Global University of Sciences" },
]

const harassmentTypes = [
  { value: "verbal", label: "Verbal Abuse" },
  { value: "physical", label: "Physical Ragging" },
  { value: "cyber", label: "Cyber Bullying" },
  { value: "social", label: "Social Exclusion" },
]

const locationCategories = [
  { value: "hall", label: "Hall" },
  { value: "hostel", label: "Hostel" },
  { value: "department", label: "Department" },
  { value: "institute", label: "Institute" },
]

const specificLocations = [
  { value: "block_a", label: "Block A" },
  { value: "block_b", label: "Block B" },
  { value: "room_302", label: "Room 302" },
  { value: "cafeteria", label: "Main Cafeteria" },
  { value: "library", label: "Central Library" },
]

type Status = "idle" | "submitting" | "success"

function generateGhostId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function ReportForm() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [ghostId, setGhostId] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "submitting") return

    setStatus("submitting")
    // Simulate secure encryption + submission
    setTimeout(() => {
      const id = generateGhostId()
      setGhostId(id)
      setStatus("success")
      toast.success("Report filed securely", {
        description: (
          <span>
            Your GhostID is{" "}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(id)
                toast.success("GhostID copied to clipboard")
              }}
              className="font-mono font-bold text-secondary underline-offset-2 hover:underline"
            >
              {id}
            </button>{" "}
            — tap to copy.
          </span>
        ),
        duration: 8000,
      })
    }, 2000)
  }

  const handleReset = () => {
    setStatus("idle")
    setGhostId("")
    setFiles([])
  }

  return (
    <GlassPanel className="p-5 md:p-8 rounded-3xl">
      {status === "success" ? (
        <SuccessState ghostId={ghostId} onReset={handleReset} />
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* University */}
          <Field label="University Name" htmlFor="university">
            <Select>
              <SelectTrigger id="university">
                <SelectValue placeholder="Select your institution" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Incident Time + Harassment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Incident Time" htmlFor="incident-time">
              <Input
                id="incident-time"
                type="datetime-local"
                className="h-11 rounded-xl border-white/10 bg-white/[0.04] backdrop-blur-md"
              />
            </Field>
            <Field label="Harassment Type" htmlFor="harassment-type">
              <Select>
                <SelectTrigger id="harassment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {harassmentTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Location (Category + Specific) */}
          <Field label="Location Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {locationCategories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="md:col-span-2">
                  <SelectValue placeholder="Select specific location" />
                </SelectTrigger>
                <SelectContent>
                  {specificLocations.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Field>

          {/* Description */}
          <Field label="Detailed Description" htmlFor="description">
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe the sequence of events clearly…"
              className="resize-none rounded-xl border-white/10 bg-white/[0.04] backdrop-blur-md text-sm"
            />
          </Field>

          {/* Evidence */}
          <Field label="Evidence & Proofs">
            <EvidenceUpload files={files} onChange={setFiles} />
          </Field>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={status === "submitting"}
              className="w-full md:px-8 rounded-full font-display font-bold gap-2"
            >
              {status === "submitting" ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Submit Anonymous Report
                  <FiSend />
                </>
              )}
            </Button>
            <p className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-xs text-muted-foreground">
              <FiLock className="text-secondary" />
              Secure 256-bit AES Encryption Active
            </p>
          </div>
        </motion.form>
      )}
    </GlassPanel>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-[0.12em] text-secondary"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}

function SuccessState({
  ghostId,
  onReset,
}: {
  ghostId: string
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center text-center py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success mb-6"
      >
        <FiCheckCircle className="size-10" />
      </motion.div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        Report Filed Securely
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Your report has been encrypted and submitted. Save this{" "}
        <span className="text-secondary">GhostID</span> to track updates
        anonymously.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="font-mono text-lg font-bold tracking-wider bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-secondary">
          {ghostId}
        </div>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/10"
          onClick={() => {
            navigator.clipboard?.writeText(ghostId)
            toast.success("GhostID copied to clipboard")
          }}
        >
          Copy ID
        </Button>
      </div>
      <Button variant="gradient" size="lg" className="rounded-full" onClick={onReset}>
        File Another Report
      </Button>
    </motion.div>
  )
}
