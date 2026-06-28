import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  // GoogleButton uses useSearchParams() and needs a Suspense boundary
  // during prerendering.
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
