"use client"

import { useState } from "react"
import { FiPaperclip, FiFileText, FiVideo, FiMic } from "react-icons/fi"
import { EvidenceItem } from "@/components/incident/evidence-item"
import { EvidenceModal, Evidence } from "@/components/incident/evidence-modal"
import { ProofUrl } from "@/types/report"

interface EvidenceGalleryProps {
  proofs: ProofUrl[] | null
}

export function EvidenceGallery({ proofs }: EvidenceGalleryProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (evidence: Evidence) => {
    setSelectedEvidence(evidence)
    setIsModalOpen(true)
  }

  if (!proofs || proofs.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 md:space-y-6 pb-4 md:pb-8">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-3">
          <FiPaperclip className="text-secondary" />
          Evidence & Proofs
        </h2>
        <span className="text-xs md:text-sm text-muted-foreground">
          {proofs.length} File{proofs.length !== 1 ? 's' : ''} Attached
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {proofs.map((proof, index) => {
          const isImage = proof.type.startsWith("image")
          const isVideo = proof.type.startsWith("video")
          const isAudio = proof.type.startsWith("audio")

          if (isImage) {
            return (
              <EvidenceItem
                key={proof.publicId}
                type="image"
                src={proof.secureUrl}
                alt={`Evidence ${index + 1}`}
                fileName={`Evidence_Image_${index + 1}`}
                delay={0.1 * (index + 1)}
                onClick={() =>
                  handleOpenModal({
                    type: "image",
                    src: proof.secureUrl,
                    alt: `Evidence ${index + 1}`,
                    fileName: `Evidence_Image_${index + 1}`,
                  })
                }
              />
            )
          }

          let Icon = FiFileText
          let iconColor = "#ffb869"
          let fileType = "Document"
          
          if (isVideo) {
            Icon = FiVideo
            iconColor = "#f43f5e"
            fileType = "Video"
          } else if (isAudio) {
            Icon = FiMic
            iconColor = "#06b6d4"
            fileType = "Audio"
          }

          return (
            <EvidenceItem
              key={proof.publicId}
              type="file"
              icon={Icon}
              iconColor={iconColor}
              fileType={fileType}
              size="Attached File"
              delay={0.1 * (index + 1)}
              onClick={() =>
                handleOpenModal({
                  type: "file",
                  icon: Icon,
                  iconColor,
                  fileType,
                  size: "Attached File",
                  src: proof.secureUrl,
                })
              }
            />
          )
        })}
      </div>

      <EvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evidence={selectedEvidence}
      />
    </section>
  )
}
