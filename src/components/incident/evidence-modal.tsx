"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FiDownload, FiMaximize2 } from "react-icons/fi"
import { IconType } from "react-icons"

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
  onClose: (open: boolean) => void
  evidence: Evidence | null
}

export function EvidenceModal({ isOpen, onClose, evidence }: EvidenceModalProps) {
  if (!evidence) return null

  const isImage = evidence.type === "image" && evidence.src
  const Icon = evidence.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-3xl p-0 overflow-hidden gap-0">
        
        {/* Header */}
        <DialogHeader className="p-4 md:p-5 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0 pr-8">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <FiMaximize2 className="text-primary text-sm md:text-base" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="font-display text-sm md:text-base font-semibold truncate text-foreground">
                {evidence.fileName || evidence.fileType || "Evidence Viewer"}
              </DialogTitle>
              {evidence.size && (
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {evidence.size}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-black/20 min-h-[40vh] md:min-h-[50vh] max-h-[70vh]">
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={evidence.src}
                alt={evidence.alt || "Evidence Image"}
                className="max-w-full max-h-[55vh] md:max-h-[60vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 w-full max-w-sm">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6"
                style={{ 
                  backgroundColor: `${evidence.iconColor}20`, 
                  color: evidence.iconColor,
                  border: `1px solid ${evidence.iconColor}40`
                }}
              >
                {Icon && <Icon className="text-4xl md:text-5xl" />}
              </div>
              <h4 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                {evidence.fileType}
              </h4>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                {evidence.size} • Click below to securely download or view this file.
              </p>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="p-4 md:p-5 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onClose(false)}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button variant="gradient" className="font-semibold gap-2">
            <FiDownload className="text-lg" />
            Download {isImage ? "Image" : "File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}