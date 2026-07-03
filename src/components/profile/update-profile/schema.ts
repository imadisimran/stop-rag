import * as z from "zod"
import { Variants } from "framer-motion"

export const SESSION_OPTIONS = [
  "2019-20",
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
]

export const ACADEMIC_CATEGORIES = [
  { value: "DEPARTMENT", label: "Department" },
  { value: "INSTITUTE", label: "Institute" },
]

export const RESIDENCE_CATEGORIES = [
  { value: "HALL", label: "Hall" },
  { value: "HOSTEL", label: "Hostel" },
]

export const fieldVariants: Variants = {
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

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  session: z.string().min(1, "Academic session is required"),
  university: z.string().min(1, "University is required"),
  academicCategory: z.string().min(1, "Academic type is required"),
  academicUnit: z.string().min(1, "Academic unit is required"),
  residenceCategory: z.string().optional(),
  residence: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof formSchema>
