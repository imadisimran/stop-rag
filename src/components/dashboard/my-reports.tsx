"use client"

import { motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"
import { dashboardReports } from "@/lib/dashboard-data"
import { ReportCard } from "./report-card"

export function MyReports() {
  return (
    <section className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
      >
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          My Reports
        </h3>
      </motion.div>

      {/* Report cards feed */}
      <div className="space-y-4">
        {dashboardReports.map((report, index) => (
          <ReportCard key={report.id} report={report} index={index} />
        ))}
      </div>

      {/* View all */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex justify-center"
      >
        <a
          href="#"
          className="glass-card px-6 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-white/[0.08] transition-all flex items-center gap-2 border border-primary/20"
        >
          View All Reports
          <FiArrowRight />
        </a>
      </motion.div>
    </section>
  )
}
