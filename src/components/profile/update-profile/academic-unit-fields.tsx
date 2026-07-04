import { Controller, UseFormReturn } from "react-hook-form"
import { FiLoader } from "react-icons/fi"
import { ProfileFormValues } from "./schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Location } from "@/types"

interface AcademicUnitFieldsProps {
  form: UseFormReturn<ProfileFormValues>
  loadingLocations: boolean
  locationsList: Location[]
  watchUniversity: string
  watchAcademicCategory: string
  availableAcademicCategories: { value: string; label: string }[]
  handleAcademicCategoryChange: (val: string) => void
}

export function AcademicUnitFields({
  form,
  loadingLocations,
  locationsList,
  watchUniversity,
  watchAcademicCategory,
  availableAcademicCategories,
  handleAcademicCategoryChange,
}: AcademicUnitFieldsProps) {
  return (
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
                    if (!val) return
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
                  onValueChange={(val) => {
                    if (!val) return
                    field.onChange(val)
                  }}
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
                    {locationsList
                      .filter((l) => l.type === watchAcademicCategory)
                      .map((l) => (
                        <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                          {l.name}
                        </SelectItem>
                      ))}
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
  )
}
