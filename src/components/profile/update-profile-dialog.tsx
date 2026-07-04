"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiEdit3, FiLoader } from "react-icons/fi"
import { Controller } from "react-hook-form"

import { UserProfile } from "@/types"

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

import { useProfileForm } from "./update-profile/use-profile-form"
import { UniversitySelector } from "./update-profile/university-selector"
import { AcademicUnitFields } from "./update-profile/academic-unit-fields"
import { ResidenceFields } from "./update-profile/residence-fields"
import { SESSION_OPTIONS, fieldVariants } from "./update-profile/schema"

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

  const {
    form,
    universitiesList,
    locationsList,
    loadingUnis,
    loadingLocations,
    saving,
    hasResidenceOptions,
    availableAcademicCategories,
    availableResidenceCategories,
    handleUniversityChange,
    handleAcademicCategoryChange,
    handleResidenceCategoryChange,
    onSubmit,
    watchUniversity,
    watchAcademicCategory,
    watchResidenceCategory,
  } = useProfileForm({ user, setUser, open, setOpen })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-lg bg-popover/95 backdrop-blur-xl border-white/10 shadow-[0_8px_60px_rgba(139,92,246,0.15),0_0_120px_rgba(6,182,212,0.06)] overflow-y-auto max-h-[90vh]"
        showCloseButton
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
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
          <UniversitySelector
            form={form}
            loadingUnis={loadingUnis}
            universitiesList={universitiesList}
            handleUniversityChange={handleUniversityChange}
          />

          {/* 4. Academic Unit — Merged Field (Category + Specific) */}
          <AcademicUnitFields
            form={form}
            loadingLocations={loadingLocations}
            locationsList={locationsList}
            watchUniversity={watchUniversity}
            watchAcademicCategory={watchAcademicCategory}
            availableAcademicCategories={availableAcademicCategories}
            handleAcademicCategoryChange={handleAcademicCategoryChange}
          />

          {/* 5. Residence — Merged Field (Category + Specific) */}
          <ResidenceFields
            form={form}
            loadingLocations={loadingLocations}
            locationsList={locationsList}
            watchUniversity={watchUniversity}
            watchResidenceCategory={watchResidenceCategory}
            availableResidenceCategories={availableResidenceCategories}
            handleResidenceCategoryChange={handleResidenceCategoryChange}
            hasResidenceOptions={hasResidenceOptions}
          />

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
              disabled={saving || !form.formState.isDirty}
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
