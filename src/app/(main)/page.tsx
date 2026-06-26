import { FeedHeader } from "@/components/feed/feed-header"
import { FilterTabs } from "@/components/feed/filter-tabs"
import { IncidentList } from "@/components/feed/incident-list"
import { LoadingMore } from "@/components/feed/loading-more"

export default function HomePage() {
  return (
    <>
      <FeedHeader />
      <FilterTabs />
      <IncidentList />
      <LoadingMore />
    </>
  )
}
