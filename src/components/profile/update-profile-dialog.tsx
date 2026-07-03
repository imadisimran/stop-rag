"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { FiEdit3, FiLoader } from "react-icons/fi"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { UserProfile, updateProfile } from "@/actions/profile/profile"
import { getUniversities, getLocations, Location } from "@/actions/universityInfo/university"
import { AcademicUnit, Residence } from "@/lib/types"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

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
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
}

// ─── Validation Schema ───────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  session: z.string().min(1, "Academic session is required"),
  university: z.string().min(1, "University is required"),
  academicCategory: z.string().min(1, "Academic type is required"),
  academicUnit: z.string().min(1, "Academic unit is required"),
  residenceCategory: z.string().optional(),
  residence: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof formSchema>

// ─── Component ────────────────────────────────────────────────────────────
export function UpdateProfileDialog({
  user,
  children,
  setUser,
}: {
  user: UserProfile | null
  children: React.ReactNode
  setUser?: (user: UserProfile | null) => void
}) {
  const [open, setOpen] = useState(false)

  // Data from server
  const [universitiesList, setUniversitiesList] = useState<{ id: string; name: string }[]>([])
  const [locationsList, setLocationsList] = useState<Location[]>([])

  // Loading states
  const [loadingUnis, setLoadingUnis] = useState(false)
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [saving, setSaving] = useState(false)

  // React Hook Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      university: "",
      session: "",
      academicCategory: "",
      academicUnit: "",
      residenceCategory: "",
      residence: "",
    },
  })

  const watchUniversity = form.watch("university")
  const watchAcademicCategory = form.watch("academicCategory")
  const watchResidenceCategory = form.watch("residenceCategory")

  // Dynamically determine available categories based on loaded locations
  const availableAcademicCategories = useMemo(() => {
    if (!watchUniversity || loadingLocations || locationsList.length === 0) {
      return ACADEMIC_CATEGORIES
    }
    return ACADEMIC_CATEGORIES.filter((cat) =>
      locationsList.some((loc) => loc.type === cat.value)
    )
  }, [watchUniversity, loadingLocations, locationsList])

  const availableResidenceCategories = useMemo(() => {
    if (!watchUniversity || loadingLocations || locationsList.length === 0) {
      return RESIDENCE_CATEGORIES
    }
    return RESIDENCE_CATEGORIES.filter((cat) =>
      locationsList.some((loc) => loc.type === cat.value)
    )
  }, [watchUniversity, loadingLocations, locationsList])

  const hasResidenceOptions = useMemo(() => {
    if (!watchUniversity || loadingLocations) {
      return true
    }
    return locationsList.some((loc) => loc.type === "HALL" || loc.type === "HOSTEL")
  }, [watchUniversity, loadingLocations, locationsList])

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
      const matchName = typeof details.university === "string"
        ? details.university
        : (details.university as any)?.name

      const match = universitiesList.find((u) => u.name === matchName)
      if (match) {
        matchedUniversity = `${match.id}:${match.name}`
      }
    }

    form.reset({
      name: user?.name || "",
      university: matchedUniversity,
      session: details?.academicSession || "",
      academicCategory: details?.academicUnit?.type || "",
      academicUnit: details?.academicUnit
        ? `${details.academicUnit.type}:${details.academicUnit.id}:${details.academicUnit.name}`
        : "",
      residenceCategory: details?.residence?.type || "",
      residence: details?.residence
        ? `${details.residence.type}:${details.residence.id}:${details.residence.name}`
        : "",
    })
  }, [open, universitiesList, user, form])

  // ─── Fetch locations when university changes ─────────────────────────
  useEffect(() => {
    if (!watchUniversity) {
      setLocationsList([])
      return
    }

    const fetchLocations = async () => {
      const uniId = watchUniversity.split(":")[0]
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
  }, [watchUniversity])



  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleUniversityChange = (val: string) => {
    form.setValue("university", val, { shouldValidate: true })
    form.setValue("academicCategory", "")
    form.setValue("academicUnit", "")
    form.setValue("residenceCategory", "")
    form.setValue("residence", "")
  }

  const handleAcademicCategoryChange = (val: string) => {
    form.setValue("academicCategory", val, { shouldValidate: true })
    form.setValue("academicUnit", "")
  }

  const handleResidenceCategoryChange = (val: string) => {
    form.setValue("residenceCategory", val, { shouldValidate: true })
    form.setValue("residence", "")
  }

  // ─── Handle save ─────────────────────────────────────────────────────
  const onSubmit = async (data: ProfileFormValues) => {
    // Custom validation for residence options
    if (hasResidenceOptions) {
      if (!data.residenceCategory) {
        form.setError("residenceCategory", { type: "manual", message: "Residence type is required" })
        return
      }
      if (!data.residence) {
        form.setError("residence", { type: "manual", message: "Residence is required" })
        return
      }
    }

    setSaving(true)
    try {
      const res = await updateProfile({
        name: data.name,
        university: data.university,
        academicUnit: data.academicUnit,
        residence: data.residence || "",
        session: data.session,
      })

      if (res.success) {
        toast.success("Profile updated successfully")
        if (setUser && user) {
          const [uniId, uniName] = data.university.split(":")
          const [academicType, academicId, academicName] = data.academicUnit.split(":")
          const [residenceType, residence, residenceName] = (data.residence || "::").split(":")

          const updatedUser: UserProfile = {
            ...user,
            name: data.name.trim(),
            isProfileComplete: true,
            studentDetails: {
              university: { id: uniId, name: uniName },
              academicSession: data.session,
              academicUnit: {
                type: academicType as AcademicUnit["type"],
                id: academicId,
                name: academicName,
              },
              residence: data.residence
                ? {
                    type: residenceType as Residence["type"],
                    id: residence,
                    name: residenceName,
                  }
                : null,
            },
          }
          setUser(updatedUser)
        }
        setOpen(false)
      } else {
        toast.error(res.message || "Failed to update profile")
      }
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-lg bg-popover/95 backdrop-blur-xl border-white/10 shadow-[0_8px_60px_rgba(139,92,246,0.15),0_0_120px_rgba(6,182,212,0.06)] overflow-y-auto max-h-[90vh]"
        showCloseButton
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        // 2. Safely prevent standard closing behaviors on layered element interactions
        onInteractOutside={(e) => {
          e.preventDefault();
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* 1. Name */}
            <motion.div
              key="name"
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                      Student Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your name"
                      className="bg-white/[0.04] border-white/10 backdrop-blur-md rounded-xl h-11 px-4 text-white placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-200"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* 2. Session Dropdown */}
            <motion.div
              key="session"
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Controller
                name="session"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                      Academic Session
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* 3. University Dropdown */}
            <motion.div
              key="university"
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Controller
                name="university"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                      University
                    </FieldLabel>
                    {loadingUnis ? (
                      <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                        <FiLoader className="animate-spin text-primary" />
                        <span className="font-mono text-xs">Loading universities...</span>
                      </div>
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val)
                          handleUniversityChange(val)
                        }}
                      >
                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                    )}
                  </Field>
                )}
              />
            </motion.div>

            {/* 4. Academic Unit — Merged Field (Category + Specific) */}
            <motion.div
              key="academic-unit"
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <Field>
                <FieldLabel className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                  Academic Unit
                </FieldLabel>
                {loadingLocations ? (
                  <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                    <FiLoader className="animate-spin text-primary" />
                    <span className="font-mono text-xs">Loading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white/[0.06] transition-all duration-200">
                    {/* Category selector */}
                    <div className="flex-1 min-w-0 sm:flex-[2_2_0%]">
                      <Controller
                        name="academicCategory"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val)
                              handleAcademicCategoryChange(val)
                            }}
                            disabled={!watchUniversity}
                          >
                            <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                              <SelectValue
                                placeholder={watchUniversity ? "Type" : "Select university first"}
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
                        )}
                      />
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px sm:w-px sm:h-auto bg-white/10 self-stretch shrink-0" />

                    {/* Specific location selector */}
                    <div className="flex-1 min-w-0 sm:flex-[3_3_0%]">
                      <Controller
                        name="academicUnit"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!watchUniversity || !watchAcademicCategory}
                          >
                            <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                              <SelectValue
                                placeholder={
                                  !watchUniversity
                                    ? "Select university first"
                                    : !watchAcademicCategory
                                      ? "Select type first"
                                      : "Select location"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {locationsList.filter((l) => l.type === watchAcademicCategory).length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No academic units available
                                </SelectItem>
                              ) : (
                                locationsList
                                  .filter((l) => l.type === watchAcademicCategory)
                                  .map((l) => (
                                    <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                                      {l.name}
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                )}
                {/* Display errors for both selectors */}
                {form.formState.errors.academicCategory && (
                  <FieldError errors={[form.formState.errors.academicCategory]} className="font-mono text-[10px] uppercase tracking-widest text-destructive mt-1" />
                )}
                {form.formState.errors.academicUnit && (
                  <FieldError errors={[form.formState.errors.academicUnit]} className="font-mono text-[10px] uppercase tracking-widest text-destructive mt-1" />
                )}
              </Field>
            </motion.div>

            {/* 5. Residence — Merged Field (Category + Specific) */}
            <AnimatePresence>
              {hasResidenceOptions && (
                <motion.div
                  key="residence"
                  custom={4}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                <Field>
                  <FieldLabel className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                    Residence
                  </FieldLabel>
                  {loadingLocations ? (
                    <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground text-sm">
                      <FiLoader className="animate-spin text-primary" />
                      <span className="font-mono text-xs">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white/[0.06] transition-all duration-200">
                      {/* Category selector */}
                      <div className="flex-1 min-w-0 sm:flex-[2_2_0%]">
                        <Controller
                          name="residenceCategory"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => {
                                field.onChange(val)
                                handleResidenceCategoryChange(val)
                              }}
                              disabled={!watchUniversity}
                            >
                              <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                                <SelectValue
                                  placeholder={watchUniversity ? "Type" : "Select university first"}
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
                          )}
                        />
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px sm:w-px sm:h-auto bg-white/10 self-stretch shrink-0" />

                      {/* Specific location selector */}
                      <div className="flex-1 min-w-0 sm:flex-[3_3_0%]">
                        <Controller
                          name="residence"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!watchUniversity || !watchResidenceCategory}
                            >
                              <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                                <SelectValue
                                  placeholder={
                                    !watchUniversity
                                      ? "Select university first"
                                      : !watchResidenceCategory
                                        ? "Select type first"
                                        : "Select location"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {locationsList.filter((l) => l.type === watchResidenceCategory).length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No residence options available
                                  </SelectItem>
                                ) : (
                                  locationsList
                                    .filter((l) => l.type === watchResidenceCategory)
                                    .map((l) => (
                                      <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                                        {l.name}
                                      </SelectItem>
                                    ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {/* Display errors for both residence selectors */}
                  {form.formState.errors.residenceCategory && (
                    <FieldError errors={[form.formState.errors.residenceCategory]} className="font-mono text-[10px] uppercase tracking-widest text-destructive mt-1" />
                  )}
                  {form.formState.errors.residence && (
                    <FieldError errors={[form.formState.errors.residence]} className="font-mono text-[10px] uppercase tracking-widest text-destructive mt-1" />
                  )}
                </Field>
              </motion.div>
            )}
            </AnimatePresence>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <DialogFooter className="bg-transparent border-white/[0.06] mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white font-mono text-[11px] uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
