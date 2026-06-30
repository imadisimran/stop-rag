"use client"

import { motion } from "framer-motion"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileNameCard } from "@/components/profile/profile-name-card"
import { ProfileCommsCard } from "@/components/profile/profile-comms-card"
import { ProfileInfoGrid } from "@/components/profile/profile-info-grid"
import { AcademicDivisionCard } from "@/components/profile/academic-division-card"
import { AffiliationCard } from "@/components/profile/affiliation-card"
import { SystemIdentifierCard } from "@/components/profile/system-identifier-card"
import { AccessControlCard } from "@/components/profile/access-control-card"

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Area */}
      <ProfileHeader />

      {/* Main Grid: Responsive layout for mobile, tablet, and desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Area (Identity & Comms Details): Col Span 4 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Header System Logs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-1 font-mono text-[11px]"
          >
            <p className="text-muted-foreground">SYSTEM_LOG_v2.04</p>
            <p className="text-foreground/75">
              Security Clearance Alpha. Integrity Status: <span className="text-secondary font-semibold">Verified</span>.
            </p>
          </motion.div>

          <ProfileNameCard />
          <ProfileCommsCard />
          <ProfileInfoGrid />
        </div>

        {/* Right Area (Academic & Actions): Col Span 8 */}
        <div className="lg:col-span-8 space-y-6">
          <AcademicDivisionCard />

          {/* Affiliation & System ID row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AffiliationCard />
            <SystemIdentifierCard />
          </div>

          <AccessControlCard />
        </div>

      </div>
    </div>
  )
}
