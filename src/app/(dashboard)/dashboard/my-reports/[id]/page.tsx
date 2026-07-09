import { BackButton } from "@/components/incident/back-button"
import { HeroSection } from "@/components/incident/hero-section"
import { MetadataCard } from "@/components/incident/metadata-card"
import { MyReportDescriptionSection } from "@/components/my-reports/description-section"
import { ActionTimeline } from "@/components/incident/action-timeline"
import { EvidenceGallery } from "@/components/incident/evidence-gallery"
import { FiUser, FiMapPin, FiAlertCircle } from "react-icons/fi"
import { getUserReportDetails } from "@/actions/report/report"
import { notFound } from "next/navigation"
import { StatusBanner } from "@/components/my-reports/status-banner"

export default async function MyReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const response = await getUserReportDetails(id)
  
  if (!response.success || !response.data) {
    notFound()
  }

  const incident = response.data

  return (
    <div className="max-w-[1000px] w-full space-y-6 md:space-y-8 pb-20 md:pb-10">
      {/* Back Action */}
      <div className="mb-2">
        <BackButton label="Back to My Reports" />
      </div>

      {/* Hero Section */}
      <HeroSection 
        title={incident.title}
        postId={incident.postId}
        date={incident.createdAt}
        universityName={incident.university}
        severity={incident.severity || "LOW"}
        showFlagButton={false}
      />

      {/* Status & Appeal Note Banner */}
      <StatusBanner
        status={incident.status}
        postId={incident.postId}
        adminVerification={incident.adminVerification}
      />

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <MetadataCard
          icon={FiUser}
          iconColor="#a78bfa"
          label="Reporter Identity"
          title={`UserId: ${incident.student.userId}`}
          subtitle1={`Session: ${incident.student.academicSession}`}
        />
        <MetadataCard
          icon={FiMapPin}
          iconColor="#06b6d4"
          label="Location Detail"
          title={incident.location}
          subtitle1={incident.university}
        />
        <MetadataCard
          icon={FiAlertCircle}
          iconColor="#ffb869"
          label="Incident Severity"
          title={incident.incidentType}
          subtitle1={`Severity: ${incident.severity ? incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1).toLowerCase() : "Low"}`}
          subtitle2={`Status: ${incident.status}`}
        />
      </div>

      {/* Description Section with Tabs */}
      <MyReportDescriptionSection 
        sanitizedDescription={incident.description} 
        rawDescription={incident.rawDescription} 
      />

      {/* Proofs Gallery */}
      <EvidenceGallery proofs={incident.proofUrls} />

      {/* Action Timeline */}
      <ActionTimeline />
    </div>
  )
}
