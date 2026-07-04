import { UserProfile } from "@/types"
import { motion } from "framer-motion"

export function ProfileAcademicUnitCard({ user }: { user: UserProfile | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative lg:after:content-[''] lg:after:absolute lg:after:left-[-24px] lg:after:top-1/2 lg:after:w-6 lg:after:h-[1px] lg:after:bg-secondary lg:after:shadow-[0_0_8px_#4cd7f6] lg:after:opacity-40"
    >
      <div className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-6 rounded-2xl h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <h3 className="text-[10px] text-secondary uppercase font-mono tracking-widest mb-4">{user?.studentDetails?.academicUnit?.type || "N/A"}</h3>
        <p className="font-display text-lg md:text-xl text-white">
          {user?.studentDetails?.academicUnit?.name || "N/A"}
        </p>
      </div>
    </motion.div>
  )
}
