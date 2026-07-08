"use client"

import { motion } from "framer-motion"
import { FiAlignLeft, FiEye, FiEyeOff } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MyReportDescriptionSectionProps {
  sanitizedDescription: string
  rawDescription: string
}

export function MyReportDescriptionSection({
  sanitizedDescription,
  rawDescription,
}: MyReportDescriptionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassPanel className="p-6 md:p-8 rounded-3xl space-y-6">
        <Tabs defaultValue="sanitized" className="w-full flex-col">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-3">
              <FiAlignLeft className="text-primary" />
              Report Description
            </h2>

            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-auto self-start sm:self-auto">
              <TabsTrigger
                value="sanitized"
                className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 text-muted-foreground hover:text-white"
              >
                <FiEye className="w-3.5 h-3.5" />
                Sanitized Description
              </TabsTrigger>
              <TabsTrigger
                value="raw"
                className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-secondary/25 text-muted-foreground hover:text-white"
              >
                <FiEyeOff className="w-3.5 h-3.5" />
                Raw Description
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-[120px]">
            <TabsContent value="sanitized" className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {sanitizedDescription || "No sanitized description available."}
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="raw" className="mt-0 outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-secondary/15 border border-secondary/30 rounded-2xl p-4 flex items-start gap-3">
                  <FiEyeOff className="text-secondary w-5 h-5 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">Confidential View</p>
                    <p className="text-xs text-muted-foreground leading-normal">
                      This is the raw description you submitted. It is kept secure and only visible to you and verified platform administrators.
                    </p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {rawDescription || "No raw description available."}
                </p>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </GlassPanel>
    </motion.div>
  )
}
