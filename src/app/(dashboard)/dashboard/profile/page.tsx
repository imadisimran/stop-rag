"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileNameCard } from "@/components/profile/profile-name-card"
import { ProfileCommsCard } from "@/components/profile/profile-comms-card"
import { ProfileSessionCard } from "@/components/profile/profile-session-card"
import { ProfileUniversityCard } from "@/components/profile/profile-university-card"
import { ProfileAcademicUnitCard } from "@/components/profile/profile-academic-unit-card"
import { ProfileResidenceCard } from "@/components/profile/profile-residence-card"
import { ProfileAccessControlCard } from "@/components/profile/profile-access-control-card"
import { useEffect, useState } from "react"
import { getProfile } from "@/actions/profile/profile"
import { UserProfile } from "@/types"
import { ProfileLoading } from "@/components/profile/profile-loading"
import { ProfileError } from "@/components/profile/profile-error"


export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [err, setErr] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const fetchProfile = async () => {
    setLoading(true)
    setErr("")
    try {
      const res = await getProfile()
      if (res.success && res?.data) {
        setUser(res.data)
      } else {
        setErr(res?.message || "Failed to load system identity node")
      }
    } catch (e: any) {
      setErr(e.message || "An unexpected error occurred during node decryption")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <ProfileLoading />
    )
  }

  if (err) {
    return (
      <ProfileError err={err} fetchProfile={fetchProfile} />
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Area */}
      <ProfileHeader user={user} />

      {/* Main Grid: Responsive layout for mobile, tablet, and desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Area (Identity & Comms Details): Col Span 4 */}
        <div className="lg:col-span-4 space-y-6">

          <ProfileNameCard user={user} />
          <ProfileCommsCard user={user} />
          <ProfileSessionCard user={user} />
        </div>

        {/* Right Area (Academic & Actions): Col Span 8 */}
        <div className="lg:col-span-8 space-y-6">
          <ProfileUniversityCard user={user} />

          {/* Affiliation & System ID row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileAcademicUnitCard user={user} />
            <ProfileResidenceCard user={user} />
          </div>

          <ProfileAccessControlCard user={user} setUser={setUser} />
        </div>

      </div>
    </div>
  )
}
