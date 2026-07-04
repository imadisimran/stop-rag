import { ReportHeader } from "@/components/report/report-header"
import { ReportForm } from "@/components/report/report-form"
import { ReportSidebar } from "@/components/report/report-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ProfileIncompleteWarning } from "@/components/profile/profile-incomplete-warning"

export default async function ReportIncidentPage() {
  const session = await getServerSession(authOptions)
  const isProfileComplete = session?.user?.isProfileComplete

  if (isProfileComplete === false) {
    return (
      <div className="mx-auto max-w-[1200px]">
        <ReportHeader />
        <ProfileIncompleteWarning />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Form column */}
      <section className="">
        <ReportHeader />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <ReportForm />
          </div>
          {/* Info sidebar */}
          <div className="lg:col-span-4">
            <ReportSidebar />
          </div>
        </div>

      </section>
    </div>
  )
}

