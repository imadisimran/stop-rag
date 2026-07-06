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
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import type { PublicReportCardData, ReportStatus } from "@/types";
import { format, formatDistanceToNow } from "date-fns";

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

export function IncidentCard({ data }: { data: PublicReportCardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const createdAtDate = new Date(data.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const formattedDate = format(createdAtDate, "MMM dd, yyyy");
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const currentStatus = statusConfig[data.status] || statusConfig.PENDING;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={() => router.push(`/incidents/${data?.postId}`)}
      className="glass-card relative group cursor-pointer p-6 flex flex-col hover:border-primary/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 animate-fade-in h-full"
    >
      {/* Outer subtle gradient border overlay for premium depth */}
      <div className="absolute -inset-[1px] rounded-[20px] bg-gradient-to-br from-primary/20 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* Content wrapper to sit above background effects */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* Top Row: Thumbnail + Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail / Category Icon Placeholder */}
          {data.thumbnailUrl && (
            <div className="relative flex-shrink-0 w-full md:w-[180px] h-[180px] rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <Image
                src={data.thumbnailUrl}
                alt={data.title}
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>
          )}

          {/* Right Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h2 className="font-display text-[20px] md:text-[22px] font-bold text-white leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
              {data.title}
            </h2>

            {/* Metadata */}
            <div className="space-y-2 mb-5 font-body">
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <Clock className="w-4 h-4 text-primary/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">Date/Time:</span>{" "}
                  {data.createdAt ? `${formattedDate} (${timeAgo})` : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <MapPin className="w-4 h-4 text-secondary/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">Location:</span>{data.university} | {data.location}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <Hash className="w-4 h-4 text-accent/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">ID:</span> {data.postId}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/90">
                <Users className="w-4 h-4 text-primary/70 shrink-0" />
                <span>
                  <span className="text-white/40 font-semibold">Reporter ID:</span> {data.userId}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "font-display px-5 py-1.5 rounded-full text-[12px] font-bold tracking-wider border transition-all duration-300",
                  currentStatus.className
                )}
              >
                {currentStatus.label}
              </span>
              <Badge
                variant={data.severity === "HIGH" ? "destructive" : data.severity === "MEDIUM" ? "tertiary" : "secondary"}
                className="font-display px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase"
              >
                {data.severity} Severity
              </Badge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        {/* Description */}
        <p className="font-body text-[14px] leading-relaxed text-muted-foreground/95 mb-5">
          <span className="text-white/50 font-semibold">Reported:</span> {data.description}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between font-display">
          <div className="flex items-center gap-5">
            {/* Comments */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn cursor-pointer"
            >
              <MessageCircle className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform text-primary/80" />
              <span className="text-[13px] font-semibold">{data.comments}</span>
            </button>

            {/* Likes */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors group/btn cursor-pointer"
            >
              <Heart className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform text-destructive/80" />
              <span className="text-[13px] font-semibold">{data.likes}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-muted-foreground/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all cursor-pointer"
            >
              <Share2 className="w-[18px] h-[18px]" />
            </button>

            {/* More */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-muted-foreground/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}