"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiDownload, FiMic, FiFileText, FiMaximize2 } from "react-icons/fi"
import { IconType } from "react-icons"
import { useEffect } from "react"

export interface Evidence {
  type: "image" | "file"
  src?: string
  alt?: string
  fileName?: string
  icon?: IconType
  iconColor?: string
  fileType?: string
  size?: string
}

interface EvidenceModalProps {
  isOpen: boolean
  onClose: () => void
  evidence: Evidence | null
}

export function EvidenceModal({ isOpen, onClose, evidence }: EvidenceModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && evidence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <FiMaximize2 className="text-primary text-sm md:text-base" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm md:text-base font-semibold truncate text-foreground">
                    {evidence.fileName || evidence.fileType || "Evidence Viewer"}
                  </h3>
                  {evidence.size && (
                    <p className="text-xs text-muted-foreground">{evidence.size}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden sm:flex p-2.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-primary">
                  <FiDownload className="text-base" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-lg hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-black/20">
              {evidence.type === "image" && evidence.src ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={evidence.src}
                    alt={evidence.alt || "Evidence Image"}
                    className="max-w-full max-h-[60vh] md:max-h-[65vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 w-full max-w-sm">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ 
                      backgroundColor: `${evidence.iconColor}20`, 
                      color: evidence.iconColor 
                    }}
                  >
                    {evidence.icon && <evidence.icon className="text-4xl md:text-5xl" />}
                  </div>
                  <h4 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                    {evidence.fileType}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-8">
                    {evidence.size} • Click below to securely download or view this file.
                  </p>
                  <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center gap-2 shadow-glow-purple hover:scale-[1.02] transition-transform">
                    <FiDownload className="text-lg" />
                    Download File
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Download Bar (Visible only on small screens) */}
            {evidence.type === "image" && (
              <div className="sm:hidden p-4 border-t border-white/10 shrink-0">
                <button className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground font-medium flex items-center justify-center gap-2">
                  <FiDownload className="text-base" />
                  Download Image
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}