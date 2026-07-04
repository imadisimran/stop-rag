import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { updateProfile } from "@/actions/profile/profile"
import { getUniversities, getLocations } from "@/actions/universityInfo/university"
import { UserProfile, Location } from "@/types"
import { AcademicUnit, Residence } from "@/types"
import { formSchema, ProfileFormValues, ACADEMIC_CATEGORIES, RESIDENCE_CATEGORIES } from "./schema"

export function useProfileForm({
  user,
  setUser,
  open,
  setOpen,
}: {
  user: UserProfile | null
  setUser?: (user: UserProfile | null) => void
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { update } = useSession()

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
    if (!watchUniversity) {
      return false
    }
    if (loadingLocations) {
      const currentResidence = form.getValues("residence")
      return !!(currentResidence && currentResidence !== "")
    }
    return locationsList.some((loc) => loc.type === "HALL" || loc.type === "HOSTEL")
  }, [watchUniversity, loadingLocations, locationsList, form])

  // Fetch universities on dialog open
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

  // Pre-fill form with existing user data once universities load
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

  // Fetch locations when university changes
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

  const handleUniversityChange = (val: string) => {
    form.setValue("university", val, { shouldValidate: true, shouldDirty: true })
    form.setValue("academicCategory", "", { shouldDirty: true })
    form.setValue("academicUnit", "", { shouldDirty: true })
    form.setValue("residenceCategory", "", { shouldDirty: true })
    form.setValue("residence", "", { shouldDirty: true })
  }

  const handleAcademicCategoryChange = (val: string) => {
    form.setValue("academicCategory", val, { shouldValidate: true, shouldDirty: true })
    form.setValue("academicUnit", "", { shouldDirty: true })
  }

  const handleResidenceCategoryChange = (val: string) => {
    form.setValue("residenceCategory", val, { shouldValidate: true, shouldDirty: true })
    form.setValue("residence", "", { shouldDirty: true })
  }

  const onSubmit = async (data: ProfileFormValues) => {
    if (!form.formState.isDirty) {
      toast.info("No changes made.")
      setOpen(false)
      return
    }

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
        // Update next-auth session token
        await update({ isProfileComplete: true, name: data.name })

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

  return {
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
  }
}
