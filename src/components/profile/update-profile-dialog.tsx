"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { FiEdit3, FiLoader } from "react-icons/fi"
import { toast } from "sonner"

import { UserProfile } from "@/actions/profile/profile"
import { getUniversities, getLocations, Location } from "@/actions/universityInfo/university"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  university: string          // composite "id:name" like report-form
  session: string
  academicCategory: string    // "DEPARTMENT" | "INSTITUTE"
  academicUnitId: string      // composite "type:id:name"
  residenceCategory: string   // "HALL" | "HOSTEL"
  residenceId: string         // composite "type:id:name"
}

// ─── Session Options ──────────────────────────────────────────────────────
const SESSION_OPTIONS = [
  "2019-20",
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
]

// ─── Category options ─────────────────────────────────────────────────────
const ACADEMIC_CATEGORIES = [
  { value: "DEPARTMENT", label: "Department" },
  { value: "INSTITUTE", label: "Institute" },
]

const RESIDENCE_CATEGORIES = [
  { value: "HALL", label: "Hall" },
  { value: "HOSTEL", label: "Hostel" },
]

// ─── Field animation variants ─────────────────────────────────────────────
const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
}

// ─── Component ────────────────────────────────────────────────────────────
export function UpdateProfileDialog({
  user,
  children,
}: {
  user: UserProfile | null
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const selectOpenRef = useRef(false) // Track if any select is open

  // Data from server
  const [universitiesList, setUniversitiesList] = useState<{ id: string; name: string }[]>([])
  const [locationsList, setLocationsList] = useState<Location[]>([])

  // Loading states
  const [loadingUnis, setLoadingUnis] = useState(false)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    university: "",
    session: "",
    academicCategory: "",
    academicUnitId: "",
    residenceCategory: "",
    residenceId: "",
  })

  // ─── Fetch universities on dialog open ────────────────────────────────
  useEffect(() => {
    if (!open) return

    const fetchUniversities = async () => {
      setLoadingUnis(true)
      try {
        const res = await getUniversities()
        if (res.success && res.data) {
          setUniversitiesList(res.data)
        } else {
          toast.error("Failed to load universities")
        }
      } catch {
        toast.error("Failed to load universities")
      } finally {
        setLoadingUnis(false)
      }
    }
    fetchUniversities()
  }, [open])

  // ─── Pre-fill form with existing user data once universities load ─────
  useEffect(() => {
    if (!open || universitiesList.length === 0) return

    const details = user?.studentDetails
    let matchedUniversity = ""

    if (details?.university) {
      const match = universitiesList.find((u) => u.name === details.university)
      if (match) {
        matchedUniversity = `${match.id}:${match.name}`
      }
    }

    setFormData({
      name: user?.name || "",
      university: matchedUniversity,
      session: details?.academicSession || "",
      academicCategory: details?.academicUnit?.type || "",
      academicUnitId: details?.academicUnit
        ? `${details.academicUnit.type}:${details.academicUnit.id}:${details.academicUnit.name}`
        : "",
      residenceCategory: details?.residence?.type || "",
      residenceId: details?.residence
        ? `${details.residence.type}:${details.residence.id}:${details.residence.name}`
        : "",
    })
  }, [open, universitiesList, user])

  // ─── Fetch locations when university changes ─────────────────────────
  useEffect(() => {
    if (!formData.university) {
      setLocationsList([])
      return
    }

    const fetchLocations = async () => {
      const uniId = formData.university.split(":")[0]
      setLoadingLocations(true)
      try {
        const res = await getLocations(uniId)
        if (res.success && res.data) {
          setLocationsList(res.data)
        } else {
          toast.error("Failed to load university locations")
        }
      } catch {
        toast.error("Failed to load university locations")
      } finally {
        setLoadingLocations(false)
      }
    }
    fetchLocations()
  }, [formData.university])

  // ─── Reset categories if not available in fetched locations ───────────
  useEffect(() => {
    if (!loadingLocations && formData.university) {
      setFormData((prev) => {
        const hasAcademic = locationsList.some((loc) => loc.type === prev.academicCategory)
        const hasResidence = locationsList.some((loc) => loc.type === prev.residenceCategory)
        return {
          ...prev,
          academicCategory: hasAcademic ? prev.academicCategory : "",
          academicUnitId: hasAcademic ? prev.academicUnitId : "",
          residenceCategory: hasResidence ? prev.residenceCategory : "",
          residenceId: hasResidence ? prev.residenceId : "",
        }
      })
    }
  }, [locationsList, loadingLocations, formData.university])

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleUniversityChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      university: val,
      academicCategory: "",
      academicUnitId: "",
      residenceCategory: "",
      residenceId: "",
    }))
  }

  const handleAcademicCategoryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      academicCategory: val,
      academicUnitId: "",
    }))
  }

  const handleResidenceCategoryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      residenceCategory: val,
      residenceId: "",
    }))
  }

  // ─── Handle save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    setSaving(true)
    try {
      // TODO: Wire up to server action for profile update
      toast.success("Profile update submitted successfully", {
        description: "Changes will be reflected after verification.",
      })
      setOpen(false)
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Dynamically determine available categories based on loaded locations
  const availableAcademicCategories =
    !formData.university || loadingLocations || locationsList.length === 0
      ? ACADEMIC_CATEGORIES
      : ACADEMIC_CATEGORIES.filter((cat) =>
          locationsList.some((loc) => loc.type === cat.value)
        )

  const availableResidenceCategories =
    !formData.university || loadingLocations || locationsList.length === 0
      ? RESIDENCE_CATEGORIES
      : RESIDENCE_CATEGORIES.filter((cat) =>
          locationsList.some((loc) => loc.type === cat.value)
        )

  // Check if university has any residence options
  const hasResidenceOptions =
    !formData.university ||
    loadingLocations ||
    locationsList.some((loc) => loc.type === "HALL" || loc.type === "HOSTEL")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-lg bg-popover/95 backdrop-blur-xl border-white/10 shadow-[0_8px_60px_rgba(139,92,246,0.15),0_0_120px_rgba(6,182,212,0.06)] overflow-y-auto max-h-[90vh]"
        showCloseButton
        onPointerDownOutside={(e) => {
          // If any select dropdown is currently open, prevent dialog close
          // Check for Radix select portal elements
          const target = e.target as Element
          const isSelectRelated = 
            target.closest('[data-radix-select-content]') !== null ||
            target.closest('[data-radix-select-trigger]') !== null ||
            document.querySelector('[data-radix-select-content][data-state="open"]') !== null

          if (isSelectRelated) {
            e.preventDefault()
          }
        }}
        // Also handle onInteractOutside as a fallback
        onInteractOutside={(e) => {
          const target = e.target as Element
          if (
            target.closest('[data-radix-select-content]') ||
            target.closest('[data-radix-select-trigger]')
          ) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-tight text-white flex items-center gap-2">
            <span className="p-1.5 bg-primary/15 rounded-md border border-primary/25">
              <FiEdit3 className="text-primary text-sm" />
            </span>
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
            USER_PROFILE_MODIFICATION // EDIT STUDENT DETAILS
          </DialogDescription>
        </DialogHeader>

        {/* ── Form Fields ──────────────────────────────────────────── */}
        <div className="space-y-5 py-2">
          <AnimatePresence mode="wait">
            {/* 1. Name */}
            <motion.div
              key="name"
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Label
                htmlFor="profile-name"
                className="text-[10px] text-secondary uppercase font-mono tracking-widest"
              >
                Student Name
              </Label>
              <Input
                id="profile-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
                className="bg-white/[0.04] border-white/10 backdrop-blur-md rounded-xl h-11 px-4 text-white placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-200"
              />
            </motion.div>

            {/* 2. Session Dropdown */}
            <motion.div
              key="session"
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Label className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                Academic Session
              </Label>
              <Select
                value={formData.session}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, session: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* 3. University Dropdown */}
            <motion.div
              key="university"
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Label className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                University
              </Label>
              {loadingUnis ? (
                <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                  <FiLoader className="animate-spin text-primary" />
                  <span className="font-mono text-xs">Loading universities...</span>
                </div>
              ) : (
                <Select
                  value={formData.university}
                  onValueChange={handleUniversityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universitiesList.map((uni) => (
                      <SelectItem key={uni.id} value={`${uni.id}:${uni.name}`}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>

            {/* 4. Academic Unit — Merged Field (Category + Specific) */}
            <motion.div
              key="academic-unit"
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Label className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                Academic Unit
              </Label>
              {loadingLocations ? (
                <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                  <FiLoader className="animate-spin text-primary" />
                  <span className="font-mono text-xs">Loading...</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white/[0.06] transition-all duration-200">
                  {/* Category selector */}
                  <div className="flex-1 min-w-0 sm:flex-[2_2_0%]">
                    <Select
                      value={formData.academicCategory}
                      onValueChange={handleAcademicCategoryChange}
                      disabled={!formData.university}
                    >
                      <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                        <SelectValue
                          placeholder={formData.university ? "Type" : "Select university first"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAcademicCategories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px sm:w-px sm:h-auto bg-white/10 self-stretch shrink-0" />

                  {/* Specific location selector */}
                  <div className="flex-1 min-w-0 sm:flex-[3_3_0%]">
                    <Select
                      value={formData.academicUnitId}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, academicUnitId: val }))
                      }
                      disabled={!formData.university || !formData.academicCategory}
                    >
                      <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                        <SelectValue
                          placeholder={
                            !formData.university
                              ? "Select university first"
                              : !formData.academicCategory
                                ? "Select type first"
                                : "Select location"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {locationsList.filter((l) => l.type === formData.academicCategory).length === 0 ? (
                          <SelectItem value="none" disabled>
                            No academic units available
                          </SelectItem>
                        ) : (
                          locationsList
                            .filter((l) => l.type === formData.academicCategory)
                            .map((l) => (
                              <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                                {l.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 5. Residence — Merged Field (Category + Specific) */}
            {hasResidenceOptions && (
              <motion.div
                key="residence"
                custom={4}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <Label className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                  Residence
                </Label>
                {loadingLocations ? (
                  <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                    <FiLoader className="animate-spin text-primary" />
                    <span className="font-mono text-xs">Loading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white/[0.06] transition-all duration-200">
                    {/* Category selector */}
                    <div className="flex-1 min-w-0 sm:flex-[2_2_0%]">
                      <Select
                        value={formData.residenceCategory}
                        onValueChange={handleResidenceCategoryChange}
                        disabled={!formData.university}
                      >
                        <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                          <SelectValue
                            placeholder={formData.university ? "Type" : "Select university first"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableResidenceCategories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px sm:w-px sm:h-auto bg-white/10 self-stretch shrink-0" />

                    {/* Specific location selector */}
                    <div className="flex-1 min-w-0 sm:flex-[3_3_0%]">
                      <Select
                        value={formData.residenceId}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, residenceId: val }))
                        }
                        disabled={!formData.university || !formData.residenceCategory}
                      >
                        <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                          <SelectValue
                            placeholder={
                              !formData.university
                                ? "Select university first"
                                : !formData.residenceCategory
                                  ? "Select type first"
                                  : "Select location"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {locationsList.filter((l) => l.type === formData.residenceCategory).length === 0 ? (
                            <SelectItem value="none" disabled>
                              No residence options available
                            </SelectItem>
                          ) : (
                            locationsList
                              .filter((l) => l.type === formData.residenceCategory)
                              .map((l) => (
                                <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                                  {l.name}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <DialogFooter className="bg-transparent border-white/[0.06]">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white font-mono text-[11px] uppercase tracking-widest"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin text-xs" />
                Saving...
              </>
            ) : (
              <>
                <FiEdit3 className="text-xs" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
