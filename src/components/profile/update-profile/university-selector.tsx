import { Controller, UseFormReturn } from "react-hook-form"
import { FiLoader } from "react-icons/fi"
import { ProfileFormValues } from "./schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

interface UniversitySelectorProps {
  form: UseFormReturn<ProfileFormValues>
  loadingUnis: boolean
  universitiesList: { id: string; name: string }[]
  handleUniversityChange: (val: string) => void
}

export function UniversitySelector({
  form,
  loadingUnis,
  universitiesList,
  handleUniversityChange,
}: UniversitySelectorProps) {
  return (
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
                if (!val) return
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
  )
}
