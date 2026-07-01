"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { FiSend, FiLoader, FiCheckCircle, FiLock, FiCalendar, FiClock, FiChevronDown } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EvidenceUpload, type UploadedFile } from "./evidence-upload"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { postReport } from "@/actions/report/report"
import { getUniversities, getLocations, type Location } from "@/actions/universityInfo/university"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { FrontendIncidentPayload, ProofUrl } from "@/lib/reportTypes"
import { cn } from "@/lib/utils"



const harassmentTypes = [
  { value: "verbal", label: "Verbal Abuse" },
  { value: "physical", label: "Physical Ragging" },
  { value: "cyber", label: "Cyber Bullying" },
  { value: "social", label: "Social Exclusion" },
]



type Status = "idle" | "submitting" | "success"

function generateGhostId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function ReportForm() {
  // Form input states
  const [university, setUniversity] = useState<string>("")
  const [incidentType, setIncidentType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [specificLocation, setSpecificLocation] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // Form error state
  const [errors, setErrors] = useState<{
    university?: string;
    incidentType?: string;
    location?: string;
    description?: string;
    date?: string;
  }>({})

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [ghostId, setGhostId] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string>("12")
  const [minute, setMinute] = useState<string>("00")
  const [period, setPeriod] = useState<"AM" | "PM">("PM")
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [universitiesList, setUniversitiesList] = useState<{ id: string; name: string }[]>([])
  const [locationsList, setLocationsList] = useState<Location[]>([])
  const [categoryList, setCategoryList] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    const fetchUniversities = async () => {
      const res = await getUniversities()
      if (res.success && res.data) {
        setUniversitiesList(res.data)
      } else {
        const errorMsg = typeof res.error === "string" ? res.error : res.error?.message || "Failed to load universities"
        toast.error(errorMsg)
      }
    }
    fetchUniversities()
  }, [])

  useEffect(() => {
    if (!university) {
      setLocationsList([])
      setCategoryList([])
      setCategory("")
      setSpecificLocation("")
      return
    }

    const fetchLocations = async () => {
      const uniId = university.split(":")[0]
      const res = await getLocations(uniId)
      if (res.success && res.data) {
        setLocationsList(res.data)
        const uniqueTypes = Array.from(new Set(res.data.map((loc) => loc.type)))
        const cats = uniqueTypes.map((type) => ({
          value: type,
          label: type.charAt(0) + type.slice(1).toLowerCase(),
        }))
        setCategoryList(cats)
      } else {
        const errorMsg = typeof res.error === "string" ? res.error : res.error?.message || "Failed to load locations"
        toast.error(errorMsg)
      }
    }
    fetchLocations()
  }, [university])

  // Handlers to clear errors on value change
  const handleUniversityChange = (val: string) => {
    setUniversity(val)
    if (errors.university) {
      setErrors((prev) => ({ ...prev, university: undefined }))
    }
  }

  const handleIncidentTypeChange = (val: string) => {
    setIncidentType(val)
    if (errors.incidentType) {
      setErrors((prev) => ({ ...prev, incidentType: undefined }))
    }
  }

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    setSpecificLocation("")
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: undefined }))
    }
  }

  const handleSpecificLocationChange = (val: string) => {
    setSpecificLocation(val)
    if (errors.location && category) {
      setErrors((prev) => ({ ...prev, location: undefined }))
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }))
    }
  }

  // Combine date, hour, minute, and period into a single 24-hour formatted ISO value for form submission
  const getCombinedDateTime = () => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // Convert 12h to 24h format
    let h = parseInt(hour, 10)
    if (period === "PM" && h !== 12) {
      h += 12
    } else if (period === "AM" && h === 12) {
      h = 0
    }
    const hh = String(h).padStart(2, '0')

    return `${year}-${month}-${day}T${hh}:${minute}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "submitting") return

    const newErrors: typeof errors = {}
    if (!university) {
      newErrors.university = "Please select a university"
    }
    if (!date) {
      newErrors.date = "Please select a date"
    }
    if (!incidentType) {
      newErrors.incidentType = "Please select an incident type"
    }
    if (!category || !specificLocation) {
      newErrors.location = "Please fill in location details"
    }
    if (!description.trim()) {
      newErrors.description = "Please provide a description of the incident"
    } else if (description.length > 3500) {
      newErrors.description = "Description can't be more than 3500 characters long"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStatus("submitting")

    try {
      let uploadedProofUrls: ProofUrl[] | null = null
      if (files.length > 0) {
        try {
          const uploadPromises = files.map((item) => uploadToCloudinary(item.file))
          uploadedProofUrls = await Promise.all(uploadPromises)
        } catch (uploadError: any) {
          console.error("Failed to upload files to Cloudinary:", uploadError)
          setStatus("idle")
          toast.error("Failed to upload evidence files. Please try again.")
          return
        }
      }

      const payload: FrontendIncidentPayload = {
        university,
        location: specificLocation,
        incidentType,
        description,
        proofUrls: uploadedProofUrls,
        date: new Date(getCombinedDateTime()),
      }

      const res = await postReport(payload)

      if (res.success && res.data) {
        setGhostId(res.data.postId)
        setStatus("success")
        toast.success("Report filed securely", {
          description: (
            <span>
              Your GhostID is{" "}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(res.data!.postId)
                  toast.success("GhostID copied to clipboard")
                }}
                className="font-mono font-bold text-secondary underline-offset-2 hover:underline"
              >
                {res.data.postId}
              </button>{" "}
              — tap to copy.
            </span>
          ),
          duration: 8000,
        })
      } else {
        setStatus("idle")
        toast.error(res.message || "Failed to submit report")
      }
    } catch (error) {
      console.error(error)
      setStatus("idle")
      toast.error("Something went wrong")
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setGhostId("")
    setFiles([])
    setDate(undefined)
    setHour("12")
    setMinute("00")
    setPeriod("PM")
    setUniversity("")
    setIncidentType("")
    setCategory("")
    setSpecificLocation("")
    setDescription("")
    setErrors({})
  }

  return (
    <GlassPanel className="p-5 md:p-8 rounded-3xl">
      {status === "submitting" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <GlassPanel className="p-6 md:p-8 max-w-sm w-full mx-4 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-2xl border-white/10">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <div className="absolute animate-ping h-8 w-8 rounded-full bg-primary/20"></div>
            </div>
            <h4 className="font-display font-bold text-lg text-foreground animate-pulse">
              {files.length > 0 ? "Uploading & Encrypting" : "Submitting Report"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {files.length > 0
                ? `Uploading ${files.length} evidence file(s) securely to Cloudinary...`
                : "Submitting your anonymous report securely..."}
            </p>
          </GlassPanel>
        </div>
      )}
      {status === "success" ? (
        <SuccessState ghostId={ghostId} onReset={handleReset} />
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* University */}
          <Field label="University Name" htmlFor="university">
            <Select value={university} onValueChange={handleUniversityChange}>
              <SelectTrigger id="university">
                <SelectValue placeholder="Select your institution" />
              </SelectTrigger>
              <SelectContent>
                {universitiesList.map((u) => (
                  <SelectItem key={u.id} value={`${u.id}:${u.name}`}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.university && (
              <span className="text-xs text-destructive font-medium mt-1">{errors.university}</span>
            )}
          </Field>

          {/* Incident Time + Harassment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                Incident Date & Time
              </span>
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06] hover:bg-white/[0.08] hover:text-foreground font-normal transition-all"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FiCalendar className="text-muted-foreground shrink-0 size-4" />
                      {date ? `${format(date, "PPP")} at ${hour}:${minute} ${period}` : "Select date & time"}
                    </span>
                    <FiChevronDown className="h-4 w-4 opacity-60 shrink-0 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border border-white/10 bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden" align="start">
                  <div className="flex flex-col">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        if (errors.date) {
                          setErrors((prev) => ({ ...prev, date: undefined }))
                        }
                      }}
                    />
                    <div className="flex items-center justify-between border-t border-white/10 p-3 bg-white/[0.02]">
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 select-none">
                        <FiClock className="size-3.5 text-secondary" /> Time
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Hour Select */}
                        <Select value={hour} onValueChange={setHour}>
                          <SelectTrigger className="h-8 w-[58px] rounded-lg px-1.5 text-xs border-white/10 bg-white/[0.02] focus:bg-white/[0.06]">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48 min-w-[58px]">
                            {Array.from({ length: 12 }).map((_, i) => {
                              const h = String(i + 1).padStart(2, "0")
                              return (
                                <SelectItem key={h} value={h} className="text-xs py-1 pl-6 pr-2">
                                  {h}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>

                        <span className="text-muted-foreground text-xs select-none">:</span>

                        {/* Minute Select */}
                        <Select value={minute} onValueChange={setMinute}>
                          <SelectTrigger className="h-8 w-[58px] rounded-lg px-1.5 text-xs border-white/10 bg-white/[0.02] focus:bg-white/[0.06]">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48 min-w-[58px]">
                            {Array.from({ length: 60 }).map((_, i) => {
                              const m = String(i).padStart(2, "0")
                              return (
                                <SelectItem key={m} value={m} className="text-xs py-1 pl-6 pr-2">
                                  {m}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>

                        {/* Period Select */}
                        <Select value={period} onValueChange={(val: "AM" | "PM") => setPeriod(val)}>
                          <SelectTrigger className="h-8 w-[58px] rounded-lg px-1.5 text-xs border-white/10 bg-white/[0.02] focus:bg-white/[0.06]">
                            <SelectValue placeholder="AM/PM" />
                          </SelectTrigger>
                          <SelectContent className="min-w-[58px]">
                            <SelectItem value="AM" className="text-xs py-1 pl-6 pr-2">AM</SelectItem>
                            <SelectItem value="PM" className="text-xs py-1 pl-6 pr-2">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {errors.date && (
                <span className="text-xs text-destructive font-medium mt-1">{errors.date}</span>
              )}
              <input type="hidden" name="incident-time" id="incident-time" value={getCombinedDateTime()} />
            </div>
            <Field label="Harassment Type" htmlFor="harassment-type">
              <Select value={incidentType} onValueChange={handleIncidentTypeChange}>
                <SelectTrigger id="harassment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {harassmentTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && (
                <span className="text-xs text-destructive font-medium mt-1">{errors.incidentType}</span>
              )}
            </Field>
          </div>

          {/* Location (Category + Specific) */}
          <Field label="Location Details">
            <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white/[0.06] transition-all duration-200">
              <div className="flex-1 min-w-0 sm:flex-[2_2_0%]">
                <Select value={category} onValueChange={handleCategoryChange} disabled={!university}>
                  <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                    <SelectValue placeholder={university ? "Category" : "Select university first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="w-full h-px sm:w-px sm:h-auto bg-white/10 self-stretch shrink-0" />

              <div className="flex-1 min-w-0 sm:flex-[3_3_0%]">
                <Select value={specificLocation} onValueChange={handleSpecificLocationChange} disabled={!university || !category}>
                  <SelectTrigger className="border-0 bg-transparent backdrop-blur-none rounded-none shadow-none focus:ring-0 focus:ring-transparent focus:bg-transparent focus:border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none h-11 w-full">
                    <SelectValue placeholder={!university ? "Select university first" : !category ? "Select category first" : "Select specific location"} />
                  </SelectTrigger>
                  <SelectContent>
                    {locationsList
                      .filter((l) => l.type === category)
                      .map((l) => (
                        <SelectItem key={l.id} value={`${l.type}:${l.id}:${l.name}`}>
                          {l.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.location && (
              <span className="text-xs text-destructive font-medium mt-1">{errors.location}</span>
            )}
          </Field>

          {/* Description */}
          <Field label="Detailed Description" htmlFor="description">
            <Textarea
              id="description"
              rows={6}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe the sequence of events clearly…"
              className="resize-none rounded-xl border-white/10 bg-white/[0.04] backdrop-blur-md text-sm"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <span className="text-xs text-destructive font-medium">{errors.description}</span>
              ) : (
                <span />
              )}
              <span className={cn("text-xs", description.length > 3500 ? "text-destructive font-semibold" : "text-muted-foreground")}>
                {description.length} / 3500
              </span>
            </div>
          </Field>

          {/* Evidence */}
          <Field label="Evidence & Proofs">
            <EvidenceUpload files={files} onChange={setFiles} />
          </Field>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={status === "submitting"}
              className="w-full md:px-8 rounded-full font-display font-bold gap-2"
            >
              Submit Anonymous Report
              <FiSend />
            </Button>
            <p className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-xs text-muted-foreground">
              <FiLock className="text-secondary" />
              Secure 256-bit AES Encryption Active
            </p>
          </div>
        </motion.form>
      )}
    </GlassPanel>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-[0.12em] text-secondary"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}

function SuccessState({
  ghostId,
  onReset,
}: {
  ghostId: string
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center text-center py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success mb-6"
      >
        <FiCheckCircle className="size-10" />
      </motion.div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        Report Filed Securely
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Your report has been encrypted and submitted. Save this{" "}
        <span className="text-secondary">GhostID</span> to track updates
        anonymously.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="font-mono text-lg font-bold tracking-wider bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-secondary">
          {ghostId}
        </div>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/10"
          onClick={() => {
            navigator.clipboard?.writeText(ghostId)
            toast.success("GhostID copied to clipboard")
          }}
        >
          Copy ID
        </Button>
      </div>
      <Button variant="gradient" size="lg" className="rounded-full" onClick={onReset}>
        File Another Report
      </Button>
    </motion.div>
  )
}
