"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  MapPin,
  Hash,
  Users,
  Lock,
  AlertTriangle,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { ReportStatus } from "@/types";

interface IncidentCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  incidentId: string;
  status: ReportStatus;
  thumbnailUrl?: string;
  thumbnailLabel: string;
  description: string;
  comments: number;
  likes: number;
}

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  PENDING: {
    label: "PENDING",
    className:
      "border-sky-500/40 text-sky-300 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_0_12px_rgba(14,165,233,0.15)]",
  },
  PROCESSING: {
    label: "PROCESSING",
    className:
      "border-amber-500/40 text-amber-300 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_0_12px_rgba(245,158,11,0.15)]",
  },
  QUEUED: {
    label: "QUEUED",
    className:
      "border-amber-500/40 text-amber-300 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_0_12px_rgba(245,158,11,0.15)]",
  },
  ACCEPTED: {
    label: "ACCEPTED",
    className:
      "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3),inset_0_0_12px_rgba(16,185,129,0.15)]",
  },
  REJECTED: {
    label: "REJECTED",
    className:
      "border-rose-500/40 text-rose-300 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3),inset_0_0_12px_rgba(244,63,94,0.15)]",
  },
  APPEALED: {
    label: "APPEALED",
    className:
      "border-purple-500/40 text-purple-300 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3),inset_0_0_12px_rgba(168,85,247,0.15)]",
  },
};


const getIncidentIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("verbal") || lower.includes("bullying") || lower.includes("harassment")) {
    return <MessageCircle className="w-8 h-8 text-primary" />;
  }
  if (lower.includes("gathering") || lower.includes("exclusion") || lower.includes("social")) {
    return <Users className="w-8 h-8 text-secondary" />;
  }
  if (lower.includes("cyber") || lower.includes("digital")) {
    return <Lock className="w-8 h-8 text-accent" />;
  }
  if (lower.includes("physical") || lower.includes("intimidation") || lower.includes("assault")) {
    return <AlertTriangle className="w-8 h-8 text-destructive" />;
  }
  if (lower.includes("labor") || lower.includes("academic") || lower.includes("work")) {
    return <FileText className="w-8 h-8 text-primary" />;
  }
  return <Shield className="w-8 h-8 text-secondary" />;
};

export function IncidentCard({
  title,
  date,
  time,
  location,
  incidentId,
  status,
  thumbnailUrl,
  thumbnailLabel,
  description,
  comments,
  likes,
}: IncidentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const currentStatus = statusConfig[status] || statusConfig.PENDING;
  const showPlaceholder = !thumbnailUrl || imageError;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="glass-card relative group cursor-pointer p-6 flex flex-col hover:border-primary/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 animate-fade-in h-full"
    >
      {/* Outer subtle gradient border overlay for premium depth */}
      <div className="absolute -inset-[1px] rounded-[20px] bg-gradient-to-br from-primary/20 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* Content wrapper to sit above background effects */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* Top Row: Thumbnail + Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail / Category Icon Placeholder */}
          <div className="relative flex-shrink-0 w-full md:w-[180px] h-[180px] rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
            {showPlaceholder ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-4">
                {/* Ambient background glow */}
                <div className={cn(
                  "absolute w-24 h-24 rounded-full filter blur-xl opacity-20 animate-pulse",
                  status === "REJECTED" ? "bg-destructive/30" : "bg-secondary/20"
                )} />
                <div className="relative z-10 p-4 rounded-full bg-white/[0.04] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300">
                  {getIncidentIcon(title)}
                </div>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl}
                  alt={thumbnailLabel}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  onError={() => setImageError(true)}
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </>
            )}

            {/* Bottom labels */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between z-10 font-display">
              <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase truncate max-w-[100px]">
                {showPlaceholder ? "No Attachment" : thumbnailLabel}
              </span>
              <span className="text-[10px] font-semibold text-white/80 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {time}
              </span>
            </div>
          </div>

          {/* Right Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h2 className="font-display text-[20px] md:text-[22px] font-bold text-white leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
              {title}
            </h2>

            {/* Metadata */}
            <div className="space-y-2 mb-5 font-body">
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <Clock className="w-4 h-4 text-primary/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">Date/Time:</span>{" "}
                  {date} | {time}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <MapPin className="w-4 h-4 text-secondary/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">Location:</span> {location}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <Hash className="w-4 h-4 text-accent/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">ID:</span> {incidentId}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center">
              <span
                className={cn(
                  "font-display px-5 py-1.5 rounded-full text-[12px] font-bold tracking-wider border transition-all duration-300",
                  currentStatus.className
                )}
              >
                {currentStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 mb-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        {/* Description */}
        <p className="font-body text-[14px] leading-relaxed text-muted-foreground/95">
          <span className="text-white/50 font-semibold">Reported:</span> {description}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between font-display">
          <div className="flex items-center gap-5">
            {/* Comments */}
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn cursor-pointer">
              <MessageCircle className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform text-primary/80" />
              <span className="text-[13px] font-semibold">{comments}</span>
            </button>

            {/* Likes */}
            <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors group/btn cursor-pointer">
              <Heart className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform text-destructive/80" />
              <span className="text-[13px] font-semibold">{likes}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button className="p-2 text-muted-foreground/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all cursor-pointer">
              <Share2 className="w-[18px] h-[18px]" />
            </button>

            {/* More */}
            <button className="p-2 text-muted-foreground/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all cursor-pointer">
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}