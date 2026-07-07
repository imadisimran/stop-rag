import { GlassPanel } from "@/components/ui/glass-panel"
import { IconType } from "react-icons"

interface MetadataCardProps {
  icon: IconType
  iconColor: string
  label: string
  title: string
  subtitle1: string
  subtitle2?: string
}

export function MetadataCard({
  icon: Icon,
  iconColor,
  label,
  title,
  subtitle1,
  subtitle2,
}: MetadataCardProps) {
  return (
    <GlassPanel className="p-5 md:p-6 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-3" style={{ color: iconColor }}>
        <Icon className="text-lg md:text-xl" />
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="space-y-1">
        <p className="font-display text-base md:text-lg text-foreground">
          {title[0].toUpperCase() + title.slice(1)}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">{subtitle1}</p>
        {subtitle2 && <p className="text-xs md:text-sm text-muted-foreground">{subtitle2}</p>}
      </div>
    </GlassPanel>
  )
}