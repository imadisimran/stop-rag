"use client"

import { motion } from "framer-motion"
import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { reportStats } from "@/lib/dashboard-data"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"

const chartConfig = {
  accepted: { label: "Accepted", color: "var(--chart-1)" },
  flagged: { label: "Flagged", color: "var(--chart-2)" },
  review: { label: "Under Review", color: "var(--chart-5)" },
} satisfies ChartConfig

export function StatsPieCard() {
  const TrendIcon =
    reportStats.trendDirection === "down" ? FiArrowDown : FiArrowUp

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 md:p-8 lg:col-span-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group"
    >
      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      {/* Pie Chart */}
      <div className="w-full md:w-1/2 aspect-square max-w-[320px] relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full"
        >
          <PieChart>
            <Pie
              data={reportStats.slices}
              dataKey="value"
              nameKey="key"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {reportStats.slices.map((slice) => (
                <Cell key={slice.key} fill={slice.colorVar} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              className="hidden"
            />
          </PieChart>
        </ChartContainer>

        {/* Center total overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground"
          >
            {reportStats.total}
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            Total Reports
          </span>
        </div>
      </div>

      {/* Legend + trend */}
      <div className="w-full md:w-1/2 space-y-5">
        <div className="space-y-2">
          {reportStats.slices.map((slice, i) => (
            <motion.div
              key={slice.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-transparent hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: slice.colorVar,
                    boxShadow: `0 0 10px ${slice.colorVar}`,
                  }}
                />
                <span className="font-body text-sm font-medium text-foreground/90">
                  {slice.label}
                </span>
              </div>
              <span
                className="font-mono text-lg font-semibold"
                style={{ color: slice.colorVar }}
              >
                {slice.value}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground px-3 leading-relaxed">
          Data updated {reportStats.updatedAt}. Trends show a{" "}
          <span className="text-success font-bold inline-flex items-center gap-1">
            <TrendIcon className="text-xs" />
            {reportStats.trendDelta}% decrease
          </span>{" "}
          in high-severity incidents this month.
        </p>
      </div>
    </motion.div>
  )
}
