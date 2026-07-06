import { FeedHeader } from "@/components/feed/feed-header"
import { IncidentList } from "@/components/feed/incident-list"
import { getPublicReports } from "@/actions/report/report"

export default async function HomePage() {
  // Load initial page (page 1, limit 6) from MongoDB server-side for SEO
  const result = await getPublicReports({
    searchQuery: "",
    severityFilter: "All",
    dateSort: "newest",
    page: 1,
    limit: 6
  })

  const initialReports = result.success && result.data ? result.data.reports : []
  const initialHasMore = result.success && result.data ? result.data.hasMore : false

  return (
    <>
      <FeedHeader />
      <IncidentList initialReports={initialReports} initialHasMore={initialHasMore} />
    </>
  )
}

