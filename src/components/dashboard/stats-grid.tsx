import { StatsPieCard } from "./stats-pie-card"
import { ImpactScoreCard, AnonymityCard } from "./bento-cards"

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <StatsPieCard />
      {/* Right column: stacked bento cards */}
      <div className="lg:col-span-4 grid grid-rows-2 gap-6">
        <ImpactScoreCard />
        <AnonymityCard />
      </div>
    </div>
  )
}
