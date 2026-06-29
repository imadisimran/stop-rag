"use client"

import { useState } from "react"
import { BackButton } from "@/components/incident/back-button"
import { HeroSection } from "@/components/incident/hero-section"
import { MetadataCard } from "@/components/incident/metadata-card"
import { DescriptionSection } from "@/components/incident/description-section"
import { EvidenceItem } from "@/components/incident/evidence-item"
import { ActionTimeline } from "@/components/incident/action-timeline"
import { EvidenceModal, Evidence } from "@/components/incident/evidence-modal"
import { FiUser, FiMapPin, FiAlertCircle, FiMic, FiFileText, FiPaperclip } from "react-icons/fi"

export default function IncidentDetailPage() {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (evidence: Evidence) => {
    setSelectedEvidence(evidence)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8 pb-20 md:pb-10">
      {/* Back Action */}
      <div className="mb-2">
        <BackButton />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <MetadataCard
          icon={FiUser}
          iconColor="#a78bfa"
          label="Reporter Identity"
          title="@anon_992"
          subtitle1="Session: 2021-25"
          subtitle2="Verified Student Profile"
        />
        <MetadataCard
          icon={FiMapPin}
          iconColor="#06b6d4"
          label="Location Detail"
          title="Block A, Main Library"
          subtitle1="Central State University"
          subtitle2="Common Hallway Area"
        />
        <MetadataCard
          icon={FiAlertCircle}
          iconColor="#ffb869"
          label="Incident Severity"
          title="Verbal & Physical"
          subtitle1="Severity: High"
          subtitle2="Status: Under Review"
          subtitle2-new="Under Review"
        />
      </div>

      {/* Description Section */}
      <DescriptionSection />

      {/* Proofs Gallery */}
      <section className="space-y-4 md:space-y-6 pb-4 md:pb-8">
        <div className="flex justify-between items-end">
          <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-3">
            <FiPaperclip className="text-secondary" />
            Evidence & Proofs
          </h2>
          <span className="text-xs md:text-sm text-muted-foreground">
            4 Files Attached
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <EvidenceItem
            type="image"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6vFaYnEIf6vj3-ibjO6v_vFSuwalmKLwp71DTNNJH7adTxCjWXhRfZ93rObyKCDK6PyR4YzLL-Vw-vNJscI6RyotfeHRxSdmHTEww2JQP7sAcRnul4AP0VCFso6HVGflt7p68MX0rbnJN2IxAkrCOa_WAPBKu2QmfQMVA5-hA6N3vyTBpllQN3BTLpAWB6qJYXDAjoCxRz35cKujWm6qy4HgG1dDkkMy36YlMx76dpOntmgkLBdMyxKMvMWnEPG7OzEFUwCoTlw0"
            alt="Hallway"
            fileName="Hallway_Photo_01.jpg"
            delay={0.1}
            onClick={() => handleOpenModal({
              type: "image",
              src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6vFaYnEIf6vj3-ibjO6v_vFSuwalmKLwp71DTNNJH7adTxCjWXhRfZ93rObyKCDK6PyR4YzLL-Vw-vNJscI6RyotfeHRxSdmHTEww2JQP7sAcRnul4AP0VCFso6HVGflt7p68MX0rbnJN2IxAkrCOa_WAPBKu2QmfQMVA5-hA6N3vyTBpllQN3BTLpAWB6qJYXDAjoCxRz35cKujWm6qy4HgG1dDkkMy36YlMx76dpOntmgkLBdMyxKMvMWnEPG7OzEFUwCoTlw0",
              alt: "Hallway",
              fileName: "Hallway_Photo_01.jpg"
            })}
          />
          <EvidenceItem
            type="file"
            icon={FiMic}
            iconColor="#06b6d4"
            fileType="Voice Recording"
            size="03:42 • MP3"
            delay={0.2}
            onClick={() => handleOpenModal({
              type: "file",
              icon: FiMic,
              iconColor: "#06b6d4",
              fileType: "Voice Recording",
              size: "03:42 • MP3"
            })}
          />
          <EvidenceItem
            type="image"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOomP3wSo28PiwBA9I9aU9yWXPsPS2vG_vj-Jqz5_kV10plLFsTl5lD24tJ9CVjzLpJE_FgrmeDagovXYNL1V3qnf8lmP71BCBYe9CVgW5DDFv4ErzfHS5Gw5bOUt9uf1siC_NQQ9o3ntAhl9kku0mJZRNVUpW19Pg3Ed-KJqz-8XcDXhr1QXIjyK0rh6kZdorwtrJOk0p-rU-RlihGoEVQtUW1MVN9mb33TFeaSaNcYu40nIJqygx3rJT7igLVNU_SfbvQuCML54"
            alt="Transcript"
            fileName="Transcript_Log.png"
            delay={0.3}
            onClick={() => handleOpenModal({
              type: "image",
              src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOomP3wSo28PiwBA9I9aU9yWXPsPS2vG_vj-Jqz5_kV10plLFsTl5lD24tJ9CVjzLpJE_FgrmeDagovXYNL1V3qnf8lmP71BCBYe9CVgW5DDFv4ErzfHS5Gw5bOUt9uf1siC_NQQ9o3ntAhl9kku0mJZRNVUpW19Pg3Ed-KJqz-8XcDXhr1QXIjyK0rh6kZdorwtrJOk0p-rU-RlihGoEVQtUW1MVN9mb33TFeaSaNcYu40nIJqygx3rJT7igLVNU_SfbvQuCML54",
              alt: "Transcript",
              fileName: "Transcript_Log.png"
            })}
          />
          <EvidenceItem
            type="file"
            icon={FiFileText}
            iconColor="#ffb869"
            fileType="Medical Report"
            size="PDF • 1.2 MB"
            delay={0.4}
            onClick={() => handleOpenModal({
              type: "file",
              icon: FiFileText,
              iconColor: "#ffb869",
              fileType: "Medical Report",
              size: "PDF • 1.2 MB"
            })}
          />
        </div>
      </section>

      {/* Action Timeline */}
      <ActionTimeline />

      {/* Modal */}
      <EvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  )
}