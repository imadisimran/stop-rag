import Link from "next/link"
import { HeroSection } from "@/components/incident/hero-section"
import { MetadataCard } from "@/components/incident/metadata-card"
import { MyReportDescriptionSection } from "@/components/my-reports/description-section"
import { ActionTimeline } from "@/components/incident/action-timeline"
import { EvidenceGallery } from "@/components/incident/evidence-gallery"
import { FiUser, FiMapPin, FiAlertCircle, FiArrowLeft } from "react-icons/fi"
import { getUserReportDetails } from "@/actions/report/report"
import { notFound } from "next/navigation"

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
        <Link href="/dashboard/my-reports">
          <button className="bg-white/5 border border-white/15 px-5 py-3 rounded-xl flex items-center gap-3 group hover:bg-primary/10 hover:border-primary/40 transition-all text-foreground cursor-pointer">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Back to My Reports
            </span>
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <HeroSection 
        title={incident.title}
        postId={incident.postId}
        date={incident.createdAt}
        universityName={incident.university}
        severity={incident.severity || "LOW"}
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
