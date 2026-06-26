"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiUploadCloud, FiX, FiFile } from "react-icons/fi"
import { cn } from "@/lib/utils"

const MAX_SIZE_MB = 20
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED = /\.(jpg|jpeg|png|mp3|pdf)$/i

export interface UploadedFile {
  id: string
  file: File
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EvidenceUpload({
  files,
  onChange,
}: {
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return
      setError(null)

      const accepted: UploadedFile[] = []
      let rejected = 0

      Array.from(incoming).forEach((file) => {
        const isAcceptedType = ACCEPTED.test(file.name)
        const isAcceptedSize = file.size <= MAX_SIZE_BYTES
        if (isAcceptedType && isAcceptedSize) {
          accepted.push({
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,
            file,
          })
        } else {
          rejected += 1
        }
      })

      if (rejected > 0) {
        setError(
          `${rejected} file${rejected > 1 ? "s" : ""} skipped — only JPG, PNG, MP3, PDF up to ${MAX_SIZE_MB}MB.`
        )
      }

      if (accepted.length > 0) {
        onChange([...files, ...accepted])
      }
    },
    [files, onChange]
  )

  const removeFile = (id: string) => {
    onChange(files.filter((f) => f.id !== id))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isDragging) setIsDragging(true)
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 outline-none",
          isDragging
            ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
            : "border-white/15 bg-white/[0.04] hover:border-primary/50 hover:bg-white/[0.06]"
        )}
      >
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors"
        >
          <FiUploadCloud className="size-7" />
        </motion.span>
        <div>
          <p className="font-display text-sm md:text-base font-semibold text-foreground">
            {isDragging ? "Drop files to upload" : "Drop files here or browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supported: JPG, PNG, MP3, PDF (Max {MAX_SIZE_MB}MB each)
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.mp3,.pdf"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            // reset so selecting the same file again still fires onChange
            e.target.value = ""
          }}
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence initial={false}>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {files.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                  <FiFile className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(item.id)
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <FiX className="size-4" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
